// import CronJob từ thư viện cron
import { CronJob } from "cron";

// import từ các module ngoài
import { publish } from "../config/mqtt";
import { deviceValueChangeEmit } from "../config/socket";
import { DevicesModel } from "../models/Device";
import { RuleConditionModel, RuleModel } from "../models/Rule";

/**
Tạo 2 map:
jobMap: Chứa các luật theo thời gian
conditionRulesMap: Chứa các luật phụ thuộc
 */
const jobMap = new Map();
const conditionRulesMap = new Map();

/*
Hàm tạo một job cho luật theo thời gian. Trình tự thực hiện công việc:
--Đọc ra port, value và deviceId
--publish một message lên MQTT Broker để yêu cầu thiết bị ở port thay đổi giá trị
--Tim thiết bị trong database và lưu giá trị mới
--Gọi hàm deviceValueChangeEmit() báo hiệu client biết trạng thái thiết bị đã thay đổi
*/
const handleJob = (rule: any) => async () => {
  const { port, value, deviceId } = rule;
  publish({ port, value });
  const device = (await DevicesModel.findOne({ _id: deviceId })) as any;
  device.value = value;
  await device?.save();
  deviceValueChangeEmit(deviceId, value);
};

/*
Hàm tạo công việc cho luật phụ thuộc. Trình tự thực hiện công việc như sau:
--Lấy ra thông tin của thiết bị phụ thuộc
--publish một thông điệp đến MQTT Broker yêu cầu thay đổi giá trị của thiết bị này
--Cập nhật giá trị mới vào database
--Gọi hàm deviceValueChangeEmit() báo hiệu client biết trạng thái thiết bị đã thay đổi
*/
const handleRuleCondition = (rule: any) => async () => {
  const { afterPort, afterValue, afterDeviceId } = rule;
  publish({ port: afterPort, value: afterValue });

  const afterDevice = (await DevicesModel.findOne({
    _id: afterDeviceId,
  })) as any;

  afterDevice.value = afterValue;
  await afterDevice.save();
  deviceValueChangeEmit(afterDeviceId, afterValue);
};

// Hàm lấy tất cả các luật theo thời gian
const getAllRules = async () => {
  try {
    return await RuleModel.find();
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Hàm lấy tất cả các luật phụ thuộc
const getAllRulesCondition = async () => {
  try {
    return await RuleConditionModel.find();
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Hàm tạo một Cron Job sử dụng lớp CronJob từ thư viện cron
const createJob = (rule: any) => {
  return new CronJob(
    rule.time,
    handleJob(rule) as any,
    null,
    true,
    "Asia/Ho_Chi_Minh"
  );
};

// Hàm khởi tạo các luật theo thời gian bằng cách sử dụng jobMap (Là một Map Object)
const initialJob = async () => {
  const rules = await getAllRules();
  if (rules?.length) {
    rules?.map((rule: any) => {
      const job = createJob(rule);
      jobMap.set(rule._id, job);
    });
  }
};

// Hàm khởi tạo các luật phụ thuộc bằng cách sử dụng conditionRulesMap (Là một Map Object)
const initialConditionRules = async () => {
  const conditionRules = await getAllRulesCondition();
  conditionRulesMap.clear();
  if (conditionRules?.length) {
    conditionRules?.map((rule: any) => {
      const { preValue, preDeviceId } = rule;
      if (preValue === 1) {
        conditionRulesMap.set(`${preDeviceId}-on`, [
          ...(conditionRulesMap.get(`${preDeviceId}-on`) || []),
          { ruleId: rule._id, fnc: handleRuleCondition(rule) },
        ]);
      } else {
        conditionRulesMap.set(`${preDeviceId}-off`, [
          ...(conditionRulesMap.get(`${preDeviceId}-off`) || []),
          { ruleId: rule._id, fnc: handleRuleCondition(rule) },
        ]);
      }
    });
  }
};

// Gọi các hàm khởi tạo
initialConditionRules();
initialJob();

// Export các object và hàm để nơi khác sử dụng
export {
  jobMap,
  createJob,
  conditionRulesMap,
  handleRuleCondition,
  initialConditionRules,
};

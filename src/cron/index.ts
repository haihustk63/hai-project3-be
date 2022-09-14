import { CronJob } from "cron";

import { publish } from "../config/mqtt";
import { deviceValueChangeEmit } from "../config/socket";
import { DevicesModel } from "../models/Device";
import { RuleConditionModel, RuleModel } from "../models/Rule";

// cron
const jobMap = new Map();
const conditionRulesMap = new Map();

const handleJob = (rule: any) => async () => {
  const { port, value, deviceId } = rule;
  console.log(port, value);
  publish({ port, value });
  const device = (await DevicesModel.findOne({ _id: deviceId })) as any;
  device.value = value;
  await device?.save();
  deviceValueChangeEmit(deviceId, value);
};

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

const getAllRules = async () => {
  try {
    return await RuleModel.find();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getAllRulesCondition = async () => {
  try {
    return await RuleConditionModel.find();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const createJob = (rule: any) => {
  return new CronJob(
    rule.time,
    handleJob(rule) as any,
    null,
    true,
    "Asia/Ho_Chi_Minh"
  );
};

const initialJob = async () => {
  const rules = await getAllRules();
  if (rules?.length) {
    rules?.map((rule: any) => {
      const job = createJob(rule);
      jobMap.set(rule._id, job);
    });
  }
};

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

initialConditionRules();
initialJob();

export {
  jobMap,
  createJob,
  conditionRulesMap,
  handleRuleCondition,
  initialConditionRules,
};

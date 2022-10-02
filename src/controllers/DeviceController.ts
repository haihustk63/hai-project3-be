// import từ express và các module ngoài
import { Request, Response } from "express";

import { DEVICE_TYPES } from "../constants";
import { DevicesModel } from "../models/Device";
import { publish } from "../config/mqtt";
import { conditionRulesMap } from "../cron";

// Hàm này sẽ xử lý yêu cầu lấy danh sách các loại thiết bị
const getAllDeviceTypes = async (req: Request, res: Response) => {
  try {
    return res.send(DEVICE_TYPES);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

// Hàm này sẽ xử lý yêu cầu lấy danh sách thiết bị thiết bị
// ứng với từng user cụ thể
const getAllDevices = async (req: Request, res: Response) => {
  try {
    const { personId } = req.query;

    const devices = await DevicesModel.find({ personId });

    return res.send(devices);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

// Hàm này sẽ xử lý yêu cầu lấy danh sách các loại thiết bị
// dành cho Admin
const getAllDevicesAdmin = async (req: Request, res: Response) => {
  try {
    const devices = await DevicesModel.find().populate(["personId"]);

    return res.send(devices);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

// Hàm này sẽ xử lý yêu cầu tạo mới một thiết bị
const createDevice = async (req: Request, res: Response) => {
  try {
    const { personId, name, type, interact, port, config, floor, room } = req.body;

    const result = await DevicesModel.create({
      personId,
      name,
      type,
      interact,
      port,
      config,
      floor, 
      room
    });

    console.log(result)

    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
};

/* 
Hàm này sẽ xử lý yêu cầu thay đổi trạng thái của thiết bị
Tùy vào dạng data gửi đến mà có cách xử lý khác nhau
--Nếu data có minThreshold và desireThreshold thì cập nhật trường config của thiết bị
--Nếu không thì cập nhật trường value của thiết bị
Các giá trị mới này cũng được publish lên MQTT Broker nhờ vào hàm publish, nhận vào một tham số
chính là giá trị mới của thiết bị
*/
const updateDeviceById = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;

    const { minThreshold, desireThreshold, value } = req.body;

    const device = await DevicesModel.findOne({ _id: deviceId });

    if (device) {
      if (minThreshold && desireThreshold) {
        const newConfig = { minThreshold, desireThreshold };
        device.config = newConfig;
        await device.save();
        const payload = { port: device?.port, value: newConfig };
        publish(payload);
      } else {
        let newValue = device?.value === 1 ? 0 : 1;
        if (value) {
          newValue = value;
        }
        device.value = newValue;
        await device?.save();
        const payload = { port: device?.port, value: newValue };
        publish(payload);

        const fnRuleList =
          conditionRulesMap.get(
            `${deviceId}-${newValue === 1 ? "on" : "off"}`
          ) || [];
        fnRuleList.forEach((fn: any) => fn.fnc());
      }
    }

    return res.status(200).send(device);
  } catch (error) {
    return res.send(error);
  }
};

/* 
Hàm này xử lý yêu cầu bật tất cả các thiết bị là ánh sáng trong cùng một phòng
Dựa vào thông tin room, nó lấy ra danh sách các thiết bị
Ứng với mỗi thiết bị sẽ thay đổi trạng thái theo value, và publish một message lên MQTT Broker
bằng hàm publish
*/ 
const turnAllDevices = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    const { value } = req.body;
    const devices = (await DevicesModel.find({ room })) || [];

    const updateValueJob = devices.map(async (d: any) => {
      if (d.type === DEVICE_TYPES[0].value) {
        d.value = value;
        await d.save();
        const payload = { port: d.port, value };
        publish(payload);
      }
    });

    await Promise.all(updateValueJob);

    return res.status(200).send(devices);
  } catch (error) {
    return res.send(error);
  }
};

// Hàm này xử lý yêu cầu xóa một thiết bị theo id
const deleteDevice = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;

    const result = await DevicesModel.deleteOne({ _id: deviceId });

    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
};

export {
  getAllDevices,
  createDevice,
  getAllDeviceTypes,
  updateDeviceById,
  turnAllDevices,
  getAllDevicesAdmin,
  deleteDevice
};

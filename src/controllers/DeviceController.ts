import { Request, Response } from "express";

import { DEVICE_TYPES } from "../constants";
import { DevicesModel } from "../models/Device";
import { publish } from "../config/mqtt";
import { conditionRulesMap } from "../cron";

const getAllDeviceTypes = async (req: Request, res: Response) => {
  try {
    return res.send(DEVICE_TYPES);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

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

const createDevice = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { personId, name, type, interact, port, config } = req.body;

    const result = await DevicesModel.create({
      personId,
      name,
      type,
      interact,
      port,
      config,
    });

    return res.send(result);
  } catch (error) {
    // console.log(error);
    return res.send(error);
  }
};

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
        console.log(payload);
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

const turnAllDevices = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    const { value } = req.body;
    console.log(room, value)
    const devices = await DevicesModel.find({ room });

    if (devices?.length) {
      const updateValueJob = devices.map(async (d: any) => {
        if (d.type === DEVICE_TYPES[0].value) {
          return new Promise((res, rej) => {
            d.value = value;
            const payload = { port: d.port, value };
            publish(payload);
          }).then(() => d.save());
        } else return null;
      });

      await Promise.all(updateValueJob);
    }

    return res.status(200);
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
};

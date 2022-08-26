import { Request, Response } from "express";
import { DEVICE_TYPES } from "../constants";
import { DevicesModel } from "../models/Device";
import { publish } from "../config/mqtt";

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

const getDeviceById = async () => {};

const createDevice = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { personId, name, type, interact } = req.body;

    const result = await DevicesModel.create({
      personId,
      name,
      type,
      interact,
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

    const device = await DevicesModel.findOne({ _id: deviceId });

    if (device) {
      const newValue = device?.value === 1 ? 0 : 1;
      device.value = newValue;
      await device?.save();
      const payload = { port: device?.port, value: newValue };
      publish(payload);
    }

    return res.send(device);
  } catch (error) {
    return res.send(error);
  }
};

export { getAllDevices, createDevice, getAllDeviceTypes, updateDeviceById };

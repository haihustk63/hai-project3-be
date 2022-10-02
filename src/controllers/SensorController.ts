import { Request, Response } from "express";

import { SensorModel } from "../models/Sensor";

// Hàm lấy tất cả data của thiết bị sensor đó
const getAllData = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const allData = await SensorModel.find({ deviceId });

    const responseData = allData.filter((d) => d.deviceId == deviceId);

    res.status(200).send(responseData);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

// Hàm thêm một bản ghi vào database
const addData = async (req: Request, res: Response) => {
  try {
    const { deviceId, value } = req.body;
    const data = await SensorModel.create({
      deviceId,
      value,
    });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

export { getAllData, addData };

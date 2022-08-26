import { Request, Response } from "express";
import { createJob, jobMap } from "../cron";
import { DevicesModel } from "../models/Device";
import { RuleModel } from "../models/Rule";
import { compareRuleTime } from "../utils";

const createRule = async (req: Request, res: Response) => {
  try {
    const { name, device: deviceId, cronOnTime, cronOffTime } = req.body;

    const device = (await DevicesModel.findOne({ _id: deviceId })) as any;

    const data = {
      name,
      port: device?.port,
      deviceId,
    };

    const result = [];

    if (cronOnTime) {
      const dataOnTime = { ...data, time: cronOnTime, value: 1 };
      const r = await RuleModel.create(dataOnTime);
      result.push(r);
    }

    if (cronOffTime) {
      const dataOffTime = { ...data, time: cronOffTime, value: 0 };
      const r = await RuleModel.create(dataOffTime);
      result.push(r);
    }

    result.map((r) => {
      jobMap.set(r._id, createJob(r));
    });

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const getAllRules = async (req: Request, res: Response) => {
  try {
    const rules = await RuleModel.find().populate("deviceId");
    const sortRuleByTimeCron = rules.sort(compareRuleTime);
    return res.status(200).send(sortRuleByTimeCron);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const deleteRule = async (req: Request, res: Response) => {
  try {
    const { ruleId } = req.params;
    await RuleModel.deleteOne({ _id: ruleId });
    jobMap.delete(ruleId);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

export { createRule, getAllRules, deleteRule };

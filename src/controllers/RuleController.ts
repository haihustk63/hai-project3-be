import { Request, Response } from "express";
import {
  conditionRulesMap,
  createJob,
  handleRuleCondition,
  initialConditionRules,
  jobMap,
} from "../cron";
import { DevicesModel } from "../models/Device";
import { RuleConditionModel, RuleModel } from "../models/Rule";
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

// Rule - Condition

const getAllRulesCondition = async (req: Request, res: Response) => {
  try {
    const rules = await RuleConditionModel.find().populate([
      "preDeviceId",
      "afterDeviceId",
    ]);
    return res.status(200).send(rules);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const createRuleCondition = async (req: Request, res: Response) => {
  try {
    const { name, preDeviceId, preValue, afterDeviceId, afterValue } = req.body;

    const preDevice = (await DevicesModel.findOne({
      _id: preDeviceId,
    })) as any;
    const afterDevice = (await DevicesModel.findOne({
      _id: afterDeviceId,
    })) as any;

    const data = {
      name,
      preDeviceId,
      prePort: preDevice?.port,
      preValue,
      afterDeviceId,
      afterPort: afterDevice?.port,
      afterValue,
    };

    const rule = await RuleConditionModel.create(data);
    const ruleKey = `${preDeviceId}-${preValue === 1 ? "on" : "off"}`;
    conditionRulesMap.set(ruleKey, [
      ...(conditionRulesMap.get(ruleKey) || []),
      { ruleId: rule._id, fnc: handleRuleCondition(rule) },
    ]);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const deleteRuleCondition = async (req: Request, res: Response) => {
  try {
    const { ruleId } = req.params;
    await RuleConditionModel.deleteOne({ _id: ruleId });

    await initialConditionRules();

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

export {
  createRule,
  getAllRules,
  deleteRule,
  getAllRulesCondition,
  createRuleCondition,
  deleteRuleCondition,
};

import { CronJob } from "cron";
import { publish } from "../config/mqtt";
import { deviceValueChangeEmit } from "../config/socket";
import { DevicesModel } from "../models/Device";
import { RuleModel } from "../models/Rule";

// cron
const jobMap = new Map();

const handleJob = (rule: any) => async () => {
  const { port, value, deviceId } = rule;
  console.log(port, value);
  publish({ port, value });
  const device = (await DevicesModel.findOne({ _id: deviceId })) as any;
  device.value = value;
  await device?.save();
  deviceValueChangeEmit(deviceId, value);
};

const getAllRules = async () => {
  try {
    return await RuleModel.find();
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

initialJob();

// app.use("/stop-job/:jobId", (req, res, next) => {
//   const { jobId } = req.params;
//   const job = jobMap.get(jobId);
//   if (job) {
//     job.stop();
//   }
//   return res.status(200).send("OK");
// });

// app.post("/add-job", (req, res, next) => {
//   const { time, deviceID, status } = req.body;
//   const job = createNewJob({ time, deviceID, status });
//   jobMap.set(deviceID, job);
//   return res.status(200).send("OK");
// });

export { jobMap, createJob };

import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const RuleSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  time: {
    required: true,
    type: String,
  },
  port: {
    required: true,
    type: Number,
  },
  value: {
    required: true,
    type: Number,
  },
  deviceId: {
    required: true,
    type: Types.ObjectId,
    ref: "Devices",
  },
  personId: {
    required: true,
    type: Types.ObjectId,
    ref: "User",
  },
});

const RuleConditionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  preDeviceId: {
    required: true,
    type: Types.ObjectId,
    ref: "Devices",
  },
  prePort: {
    required: true,
    type: Number,
  },
  preValue: {
    required: true,
    type: Number,
  },
  afterDeviceId: {
    required: true,
    type: Types.ObjectId,
    ref: "Devices",
  },
  afterPort: {
    required: true,
    type: Number,
  },
  afterValue: {
    required: true,
    type: Number,
  },
  personId: {
    required: true,
    type: Types.ObjectId,
    ref: "User",
  },
});

const RuleModel = model("Rule", RuleSchema);
const RuleConditionModel = model("Rule Condition", RuleConditionSchema);

export { RuleSchema, RuleModel, RuleConditionModel, RuleConditionSchema };

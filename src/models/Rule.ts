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
});

const RuleModel = model("Rule", RuleSchema);

export { RuleSchema, RuleModel };

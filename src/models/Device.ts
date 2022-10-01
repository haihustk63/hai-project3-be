import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ConfigSchema = new Schema({
  minThreshold: Number,
  desireThreshold: Number,
});

export const DeviceSchema = new Schema({
  personId: {
    required: true,
    type: Types.ObjectId,
    ref: "Users",
  },
  name: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  value: {
    type: Number,
    default: 0,
  },
  interact: {
    type: Boolean,
    default: false,
  },
  port: {
    type: Number,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
  config: ConfigSchema,
});

export const DevicesModel = model("Devices", DeviceSchema);

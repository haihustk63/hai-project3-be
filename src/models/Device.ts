import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

export const DeviceSchema = new Schema({
  personId: {
    required: true,
    type: Types.ObjectId,
    ref: "User",
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
});

export const DevicesModel = model("Devices", DeviceSchema);
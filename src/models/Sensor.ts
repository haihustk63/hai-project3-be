import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

export const SensorSchema = new Schema({
  deviceId: {
    type: Types.ObjectId,
    required: true,
    ref: "Devices",
  },

  value: {
    type: Number,
    required: true,
  },
});

export const SensorModel = model("Sensors", SensorSchema);

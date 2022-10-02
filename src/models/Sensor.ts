// import thư viện mongoose 
import mongoose from "mongoose";

// Lấy ra lớp Schema và phương thức model
const { Schema, model, Types } = mongoose;

//Tạo SensorSchema
// deviceId: Id của thiết bị, value: Giá trị thiết bị đo được
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

// export SenSorModel
export const SensorModel = model("Sensors", SensorSchema);

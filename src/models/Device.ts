// import thư viện mongoose 
import mongoose from "mongoose";

// Lấy ra lớp Schema và phương thức model
const { Schema, model, Types } = mongoose;

// Tạo ConfigSchema dành cho thiết bị là cảm biến độ ẩm
const ConfigSchema = new Schema({
  minThreshold: Number,
  desireThreshold: Number,
});

// Tạo DeviceSchema 
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

// Tạo DeviceModel bằng hàm model, truyền vào 2 tham số là tên collection và schema
// export ra để bên ngoài sử dụng được DeviceModel
export const DevicesModel = model("Devices", DeviceSchema);

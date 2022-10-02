// import thư viện mongoose 
import mongoose from "mongoose";

// Lấy ra lớp Schema và phương thức model
const { Schema, model } = mongoose;

/*
Tạo UserSchema gồm: email, password, role (0: User, 1: Admin)
*/
export const UserSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: Number,
    default: 0
  },
});

// Tạo UserModel bằng hàm model, truyền vào 2 tham số là tên collection và schema
// export ra để bên ngoài sử dụng được UserModel
export const UserModel = model("Users", UserSchema);

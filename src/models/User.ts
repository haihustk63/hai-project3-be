import mongoose from "mongoose";

const { Schema, model } = mongoose;

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

export const UserModel = model("Users", UserSchema);

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
});

export const UserModel = model("Users", UserSchema);

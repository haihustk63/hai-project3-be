import mongoose from "mongoose";

export const dbConnect = () =>
  mongoose.connect(process.env.DB || "", (error) => {
    if (!error) {
      console.log("Connect DB success");
    } else {
      console.log("Failed to connect to DB - ", error);
    }
  });

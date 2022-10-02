// import thư viện mongoose
import mongoose from "mongoose";

/* 
Hàm dbConnect sẽ thực hiện kết nối database bằng cách gọi phương thức
connect từ moogoose. Hàm connect này nhận vào tham số là URI kết nối database,
và hàm callback xử lý khi kết nối thành công/thất bại
 */
export const dbConnect = () =>
  mongoose.connect(process.env.DB || "", (error) => {
    if (!error) {
      console.log("Connect DB success");
    } else {
      console.log("Failed to connect to DB - ", error);
    }
  });

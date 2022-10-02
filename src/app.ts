/*
import một số thư viện cần thiết như
dotenv: Giúp đọc các biến môi trường
express: Giúp xây dựng API
http: Tạo một HTTP Server
*/
import dotenv from "dotenv";
import express, { Application } from "express";
import { createServer } from "http";

// import các config, các route dùng trong ứng dụng
import { dbConnect } from "./config/db";
import { initialSocket } from "./config/socket";
import deviceRoute from "./routes/device";
import ruleRoute from "./routes/rule";
import userRoute from "./routes/user";
import sensorRoute from "./routes/sensor";

// Tạo một thể hiện của express bằng cách gọi express() và không
// cần truyền tham số
const app: Application = express();

// Gọi hàm config của dotenv, từ đây có thể sử dụng các biến môi trường trong file .env
dotenv.config();

// Lấy ra port của ứng dụng từ .env, nếu không có thì lấy port 7220
const PORT = process.env.APP_PORT || 7220;

// Gọi hàm dbConnect để kết nối database
dbConnect();

// Sử dụng hàm express.json() làm middleware cho mọi request đến server
app.use(express.json());

// Sử dụng các route liên quan đến user, device, rule, sensor
app.use(userRoute);
app.use(deviceRoute);
app.use(ruleRoute);
app.use(sensorRoute);

// Tạo một HTTP Server bằng hàm createServer từ thư viện http
// Truyền vào tham số là app được tạo ra bởi express
const httpServer = createServer(app);

// Server sẽ cho phép kết nối socket
// Hàm initialSocker nhận vào một đối tượng HTTP Server và cấu hình socket
initialSocket(httpServer);

// HTTP Server lắng nghe trên PORT
httpServer.listen(PORT, () => {
  console.log("App is listening on port ", PORT);
});

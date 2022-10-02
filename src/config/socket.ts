// import lớp Server từ socket.io
import { Server } from "socket.io";

// Định nghĩa các kênh socket
const SOCKET_CHANNELS = {
  DEVICE_VALUE_CHANGE: "DeviceValueChange",
  SENSOR_VALUE: "SensorValue",
};

// Tạo một thể hiện của lớp Server
let io = new Server();

// Hàm khởi tạo socket, nhận vào một đối tượng HTTP Server
const initialSocket = (httpServer: any) => {
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client: ", socket.id);
  });
};

// Các hàm dưới đây sử dụng phương thức emit để phát ra các thông điệp đi các kênh
const deviceValueChangeEmit = (deviceId: any, value: any) => {
  io.emit(SOCKET_CHANNELS.DEVICE_VALUE_CHANGE, { deviceId, value });
};

const newSensorValue = (data: any) => {
  io.emit(SOCKET_CHANNELS.SENSOR_VALUE, data);
};

export { initialSocket, io, deviceValueChangeEmit, newSensorValue };

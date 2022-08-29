import { Server } from "socket.io";
const SOCKET_CHANNELS = {
  DEVICE_VALUE_CHANGE: "DeviceValueChange",
  SENSOR_VALUE: "SensorValue",
};

let io = new Server();

const initialSocker = (httpServer: any) => {
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client: ", socket.id);
  });
};

const deviceValueChangeEmit = (deviceId: any, value: any) => {
  io.emit(SOCKET_CHANNELS.DEVICE_VALUE_CHANGE, { deviceId, value });
};

const newSensorValue = (deviceId: any, value: any) => {
  io.emit(SOCKET_CHANNELS.SENSOR_VALUE, { deviceId, value });
};

export { initialSocker, io, deviceValueChangeEmit, newSensorValue };

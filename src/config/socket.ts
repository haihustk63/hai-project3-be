import { Server } from "socket.io";

let io = new Server();

const initialSocker = (httpServer: any) => {
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client: ", socket.id);
  });
};

const deviceValueChangeEmit = (deviceId: any, value: any) => {
  io.emit("DeviceValueChange", { deviceId, value });
};

export { initialSocker, io, deviceValueChangeEmit };

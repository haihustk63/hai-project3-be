// import thư viện mqtt
import mqtt from "mqtt";

// import các model để làm việc với database
import { DevicesModel } from "../models/Device";
import { SensorModel } from "../models/Sensor";

// import hàm newSensorValue từ config/socket
import { newSensorValue } from "./socket";


// Định nghĩa các kênh MQTT (publish/subscribe)
const TOPIC_PUB = "haipham/devices/sub";
const TOPIC_SUB = "haipham/devices/pub";
const TOPIC_PUB_CONFIG = "haipham/devices/sub/config";

/* 
Tạo một mqttClient bằng phương thức connect của thư viện mqtt
Hàm này nhận vào tham số là URL của broker, và một object mô tả cấu hình của kết nối
Ví dụ ở đây object chứa thuộc tính:
clientId: id của client
reconnectPeriod: Cứ một giây kết nối lại một lần
*/

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com:1883", {
  clientId: "broker-hivemq" + Math.random().toString(),
  reconnectPeriod: 1000,
});

// mqttClient lắng nghe sự kiện connect thành công và đăng ký subscribe kênh TOPIC_SUB
mqttClient.on("connect", () => {
  console.log("Connected MQTT");

  mqttClient.subscribe(TOPIC_SUB, () => {
    console.log("Subscribe to ", TOPIC_SUB);
  });
});

// mqttClient lắng nghe sự kiện message, có thông điệp gửi đến
mqttClient.on("message", async (_topic, payload) => {
  // Đọc thông điệp ra, đó là các giá trị mới của sensor
  const data = JSON.parse(payload.toString());
  const { percent, sensorId, pumpId, pumpValue } = data;
  // Gọi hàm newSensorValue để báo cho App biết dữ liệu sensor đã thay đổi
  newSensorValue(data);
  // Nếu có trường pumpId: trạng thái của máy bơm đã thay đổi -> cập nhật lại
  if (pumpId) {
    const pump = (await DevicesModel.findOne({ _id: pumpId })) as any;
    pump.value = Number(pumpValue);
    await pump.save();
  }
  // Nếu có trường sensorId: Giá trị của sensor đã thay đổi -> cập nhật lại
  if (sensorId) {
    const sensor = (await DevicesModel.findOne({ _id: sensorId })) as any;
    sensor.value = Number(percent);
    await sensor.save();
  }
  await SensorModel.create({ deviceId: sensorId, value: percent });
});

// Hàm này giúp publish một thông diệp đi
const publish = ({
  port,
  value,
}: {
  port: number;
  value: any;
}) => {
  if (mqttClient.connected) {
    // Tùy vào kiểu giá trị
    // number: Giá trị 0/1, điều khiển những thiết bị có thể tương tác
    if (typeof value === "number") {
      mqttClient.publish(
        TOPIC_PUB,
        JSON.stringify({ port, value }),
        { qos: 0, retain: false },
        (error: any) => {
          if (error) {
            console.log(error);
          }
        }
      );
      return;
    }

    // object: Giá trị cấu hình, dành cho sensor
    if (typeof value === "object") {
      mqttClient.publish(
        TOPIC_PUB_CONFIG,
        JSON.stringify({ port, value }),
        { qos: 0, retain: false },
        (error: any) => {
          if (error) {
            console.log(error);
          }
        }
      );
      return;
    }
  }
};

export { publish };

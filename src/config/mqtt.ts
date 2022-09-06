import mqtt from "mqtt";
import { DevicesModel } from "../models/Device";
import { SensorModel } from "../models/Sensor";
import { newSensorValue } from "./socket";

const TOPIC_PUB = "haipham/devices/sub";
const TOPIC_SUB = "haipham/devices/pub";
const TOPIC_PUB_CONFIG = "haipham/devices/sub/config";

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com:1883", {
  clientId: "broker-hivemq" + Math.random().toString(),
  reconnectPeriod: 1000,
});

mqttClient.on("connect", () => {
  console.log("Connected MQTT");

  mqttClient.subscribe(TOPIC_SUB, () => {
    console.log("Subscribe to ", TOPIC_SUB);
  });
});

mqttClient.on("message", async (topic, payload) => {
  const data = JSON.parse(payload.toString());
  const { percent, sensorId, pumpId, pumpValue } = data;
  console.log(data);
  newSensorValue(data);
  if (pumpId) {
    const pump = (await DevicesModel.findOne({ _id: pumpId })) as any;
    pump.value = Number(pumpValue);
    await pump.save();
  }
  if (sensorId) {
    const sensor = (await DevicesModel.findOne({ _id: sensorId })) as any;
    sensor.value = Number(percent);
    await sensor.save();
  }
  await SensorModel.create({ deviceId: sensorId, value: percent });
});

const publish = ({
  port,
  value,
}: {
  port: number;
  value: any;
  //   adjustBrightness: number;
}) => {
  if (mqttClient.connected) {
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

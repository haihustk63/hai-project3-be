import mqtt from "mqtt";

const TOPIC_PUB = "haipham/devices/sub";
const TOPIC_SUB = "haipham/devices/pub";

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

mqttClient.on("message", (topic, payload) => {
  console.log(topic, ":", payload.toString());
});

const publish = (payload: {
  port: number;
  value: number;
//   adjustBrightness: number;
}) => {
  if (mqttClient.connected) {
    mqttClient.publish(
      TOPIC_PUB,
      JSON.stringify(payload),
      { qos: 0, retain: false },
      (error: any) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }
};

export { publish };

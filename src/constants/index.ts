// Định nghĩa các routes của ứng dụng
// Phía client (app) sẽ gọi tới các routes này
export const BASE_ROUTES = {
  DEVICE: "/devices",
  DEVICE_ADMIN: "/devices/admin",
  MODIFY_DEVICE: "/devices/:deviceId",
  DEVICE_ROOM: "/devices/room/:room",
  RULE: "/rules",
  MODIFY_RULES: "/rules/:ruleId",
  RULE_CONDITION: "/rules-condition",
  MODIFY_RULE_CONDITION: "/rules-condition/:ruleId",
  USER: "/users",
  MODIFY_USER: "/users/:userId",
  LOGIN: "/users/login",
  DEVICE_TYPES: "/devices/type",
  SENSOR: "/sensors/:deviceId",
  SENSOR_ADD_DATA: "/sensors",
};

// Định nghĩa các loại thiết bị trong hệ thống
export const DEVICE_TYPES = [
  {
    label: "Light",
    value: "light_bulb",
    interact: true,
  },
  {
    label: "Soil Moisture Sensor",
    value: "soil_moisture_sensor",
    interact: false,
  },
  {
    label: "Water Pump",
    value: "water_pump",
    interact: true,
  },
];

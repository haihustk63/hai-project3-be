export const BASE_ROUTES = {
  DEVICE: "/devices",
  MODIFY_DEVICE: "/devices/:deviceId",
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

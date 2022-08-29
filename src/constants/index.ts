export const BASE_ROUTES = {
  DEVICE: "/devices",
  UPDATE_DELETE_DEVICE: "/devices/:deviceId",
  RULE: "/rules",
  UPDATE_DELETE_RULES: "/rules/:ruleId",
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

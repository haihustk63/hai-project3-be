export const BASE_ROUTES = {
  DEVICE: "/devices",
  UPDATE_DELETE_DEVICE: "/devices/:deviceId",
  RULE: "/rules",
  UPDATE_DELETE_RULES: "/rules/:ruleId",
  USER: "/users",
  MODIFY_USER: "/users/:userId",
  LOGIN: "/users/login",
  DEVICE_TYPES: "/devices/type",
};

export const DEVICE_TYPES = [
  {
    label: "Light",
    value: "light_bulb",
    interact: true
  },
  {
    label: "Humidity & Temperature Sensor",
    value: "humd_temp_sensor",
    interact: false
  },
];

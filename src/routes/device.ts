import { Router } from "express";

import { BASE_ROUTES } from "../constants";
import {
  createDevice,
  getAllDevices,
  getAllDeviceTypes,
  turnAllDevices,
  updateDeviceById,
  getAllDevicesAdmin,
  deleteDevice
} from "../controllers/DeviceController";

const router = Router();

router.get(BASE_ROUTES.DEVICE, getAllDevices);

router.post(BASE_ROUTES.DEVICE, createDevice);

router.get(BASE_ROUTES.DEVICE_ADMIN, getAllDevicesAdmin);

router.get(BASE_ROUTES.DEVICE_TYPES, getAllDeviceTypes);

router.patch(BASE_ROUTES.MODIFY_DEVICE, updateDeviceById);

router.delete(BASE_ROUTES.MODIFY_DEVICE, deleteDevice);

export default router;

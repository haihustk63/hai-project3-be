import { Router } from "express";
import { BASE_ROUTES } from "../constants";
import {
  createDevice,
  getAllDevices,
  getAllDeviceTypes,
  updateDeviceById,
} from "../controllers/DeviceController";

const router = Router();

router.get(BASE_ROUTES.DEVICE, getAllDevices);

router.post(BASE_ROUTES.DEVICE, createDevice);

router.get(BASE_ROUTES.DEVICE_TYPES, getAllDeviceTypes);

router.patch(BASE_ROUTES.UPDATE_DELETE_DEVICE, updateDeviceById);

export default router;

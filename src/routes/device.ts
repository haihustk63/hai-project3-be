// import Router từ express
import { Router } from "express";

// import hằng số BASE_ROUTES
import { BASE_ROUTES } from "../constants";

// import các controllers
import {
  createDevice,
  getAllDevices,
  getAllDeviceTypes,
  turnAllDevices,
  updateDeviceById,
  getAllDevicesAdmin,
  deleteDevice
} from "../controllers/DeviceController";

// Tạo một thể hiện của Router
const router = Router();

// Lấy danh sách tất cả thiết bị (cho users)
router.get(BASE_ROUTES.DEVICE, getAllDevices);

// Lấy danh sách tất cả thiết bị (cho admin)
router.get(BASE_ROUTES.DEVICE_ADMIN, getAllDevicesAdmin);

// Thêm một thiết bị
router.post(BASE_ROUTES.DEVICE, createDevice);

// Lấy tất cả các loại thiết bị
router.get(BASE_ROUTES.DEVICE_TYPES, getAllDeviceTypes);

// Thay đổi giá trị của một thiết bị
router.patch(BASE_ROUTES.MODIFY_DEVICE, updateDeviceById);

// Bật tất cả các thiết bị trong phòng
router.patch(BASE_ROUTES.DEVICE_ROOM, turnAllDevices);

// Xóa một thiết bị
router.delete(BASE_ROUTES.MODIFY_DEVICE, deleteDevice);

// export router ra ngoài để nơi khác dùng được (dùng ở file index)
export default router;

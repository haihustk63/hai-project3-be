// import Router từ express
import { Router } from "express";

// import hằng số BASE_ROUTES
import { BASE_ROUTES } from "../constants";

// import các controllers
import { addData, getAllData } from "../controllers/SensorController";

// Tạo một thể hiện của Router
const router = Router();

// Lấy tất cả data của sensor
router.get(BASE_ROUTES.SENSOR, getAllData);

// Thêm một bản ghi mới
router.post(BASE_ROUTES.SENSOR_ADD_DATA, addData);

// export router ra ngoài để nơi khác dùng được (dùng ở file index)
export default router;

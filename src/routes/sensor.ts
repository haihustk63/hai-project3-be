import { Router } from "express";
import { BASE_ROUTES } from "../constants";
import { addData, getAllData } from "../controllers/SensorController";

const router = Router();

router.get(BASE_ROUTES.SENSOR, getAllData);

router.post(BASE_ROUTES.SENSOR_ADD_DATA, addData);

export default router;

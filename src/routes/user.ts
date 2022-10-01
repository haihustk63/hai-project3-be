import { Router } from "express";

import { BASE_ROUTES } from "../constants";
import {
  createNewUser,
  deleteUser,
  login,
  getAllUsers,
} from "../controllers/UserController";

const router = Router();

router.get(BASE_ROUTES.USER, getAllUsers);
router.post(BASE_ROUTES.USER, createNewUser);
router.post(BASE_ROUTES.LOGIN, login);
router.delete(BASE_ROUTES.MODIFY_USER, deleteUser);

export default router;

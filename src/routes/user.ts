import { Router } from "express";

import { BASE_ROUTES } from "../constants";
import { createNewUser, deleteUser, login } from "../controllers/UserController";

const router = Router();

router.post(BASE_ROUTES.USER, createNewUser);
router.post(BASE_ROUTES.LOGIN, login)
router.delete(BASE_ROUTES.MODIFY_USER, deleteUser);

export default router;

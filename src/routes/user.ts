// import Router từ express
import { Router } from "express";

// import hằng số BASE_ROUTES
import { BASE_ROUTES } from "../constants";

// import các controllers
import {
  createNewUser,
  login,
  getAllUsers,
} from "../controllers/UserController";

// Tạo một thể hiện của Router
const router = Router();

// router giờ đây có thể sử dụng các phương thức get, post, delete, patch, put,...
// Lấy danh sách tất cả người dùng
router.get(BASE_ROUTES.USER, getAllUsers);
// Thêm một người dùng mới
router.post(BASE_ROUTES.USER, createNewUser);
// Đăng nhập vào hệ thống
router.post(BASE_ROUTES.LOGIN, login);

// export router ra ngoài để nơi khác dùng được (dùng ở file index)
export default router;

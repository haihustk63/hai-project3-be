// import từ các thư viện
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import UserModel
import { UserModel } from "../models/User";

// Hàm lấy danh sách các users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

// Hàm tạo mới một user
const createNewUser = async (req: Request, res: Response) => {
  try {
    // Đọc dữ liệu gửi đến server gồm email và passwword
    const { email, password } = req.body;

    const saltRounds = 10;

    const findUser = await UserModel.findOne({ email });
    // Kiểm tra tài khoản đã tồn tại chưa, nếu rồi thì bắn ra một lỗi
    if (findUser?._id) {
      throw new Error("Email Existed");
    }

    // Nếu chưa thì thêm mới user và báo thành công
    bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
      await UserModel.create({ email, password: hashPassword });
      return res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// Hàm đăng nhập
const login = async (req: Request, res: Response, next: NextFunction) => {
  // Đọc thông tin từ req.body
  const { email, password } = req.body;

  // Tìm xem người dùng tồn tại hay không
  const user = await UserModel.findOne({ email });

  // Nếu không sẽ báo lỗi không tồn tại
  if (!user) {
    return res.status(401).send("Account not exist");
  }

  // Kiểm tra có đúng password không
  const verify = bcrypt.compareSync(password, user.password);

  // Nếu không báo lỗi sai thông tin đăng nhập
  if (!verify) {
    return res.status(401).send("Wrong information");
  }

  // Nếu tài khoảng tồn tại và đúng password, sinh token và gửi về cho user
  const token = jwt.sign(
    {
      data: { email, password },
    },
    process.env.SECRET_TOKEN || "",
    { expiresIn: "1h" }
  );

  return res
    .status(200)
    .send({ token, id: user._id, email: user.email, role: user.role });
};

export { createNewUser, login, getAllUsers };

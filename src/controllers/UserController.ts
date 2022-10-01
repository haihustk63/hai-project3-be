import { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const createNewUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const saltRounds = 10;

    const findUser = await UserModel.findOne({ email });
    if (findUser?._id) {
      throw new Error("Email Existed");
    }

    bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
      await UserModel.create({ email, password: hashPassword });
      return res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const updateUser = async () => {};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    await UserModel.deleteOne({ _id: userId });
  } catch (error) {
    return res.status(200).send(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(401).send("Account not exist");
  }

  const verify = bcrypt.compareSync(password, user.password);

  if (!verify) {
    return res.status(401).send("Wrong information");
  }

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

export { createNewUser, deleteUser, login, getAllUsers };

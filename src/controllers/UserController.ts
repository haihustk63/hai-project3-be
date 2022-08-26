import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken";

const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
      await UserModel.create({ email, password: hashPassword });
      console.log(1111);
      return res.sendStatus(200);
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send(error);
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

  return res.status(200).send({ token, id: user._id, email: user.email });
};

export { createNewUser, deleteUser, login };

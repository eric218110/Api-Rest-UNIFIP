import express from "express";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

function generateJWTToken(params = {}) {
  const { JWT_TOKEN } = process.env;
  return jwt.sign(params, JWT_TOKEN, {
    expiresIn: 86400,
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      res.status(400).json({
        erorr: `User already exists`,
        email,
      });
    }

    const user = await UserModel.create(req.body);

    user.password = undefined;
    const token = generateJWTToken({ id: user.id });
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({
      error: "Registration failed !",
    });
    console.log(error);
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({
        error: "email or password incorrect",
      });
    }

    const comparePassword = await bcryptjs.compare(
      password.toString(),
      user.password
    );

    if (!comparePassword) {
      res.status(404).json({
        error: "password or email incorrect",
      });
    }

    user.password = undefined;

    const token = generateJWTToken({ id: user.id });
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ erorr: "User or passwor incorrect" });
  }
});

export default router;

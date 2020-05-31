import express from "express";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import mailerProvider from "../../provider/mailer.js";

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

router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await UserModel.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailerProvider.sendMail(
      {
        to: email,
        from: "ericsilvaccp@gmail.com",
        subject: `Forgot password from ${email} ✔`,
        text: `Not problem, reset you password with token: ${token} </b>`,
        html: `<b>Not problem, reset you password with token: ${token} </b><a href='https://github.com/eric218110'>Help?</a>`,
      },
      (error) => {
        if (error) {
          res.status(401).json({
            erro: "Canot send forgot password",
          });
        }
        res.json({
          status: "OK!",
        });
      }
    );
  } catch (error) {
    res.status(401).json({ error: "No forgot password" });
  }
});

router.post("/reset_password", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!user) {
      return res.status(401).json({
        erro: "Not reset password, try again",
      });
    }

    if (token !== user.passwordResetToken) {
      return res.status(401).json({
        erro: "Invalid token",
      });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(401).json({
        erro: "Token expired, create a new token",
      });
    }

    user.password = password;

    await user.save();

    return res.json({
      status: "ok",
      message: "Password update ✔",
    });
  } catch (error) {
    res.status(401).json({
      erro: "Not reset password, try again",
    });
  }
});

export default router;

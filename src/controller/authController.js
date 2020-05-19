import express from "express";
import UserModel from "../models/user.model.js";

const router = express.Router();

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

    res.json({ user });
  } catch (error) {
    res.status(400).json({
      error: "Registration failed !",
    });
    console.log(error);
  }
});

export default router;

import express from "express";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const route = express.Router();

route.use(authMiddlewares);

route.get("/projects", (req, res) => {
  res.json({
    ok: true,
    user: req.userId
  });
});

export default route;

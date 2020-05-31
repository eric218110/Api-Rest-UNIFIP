import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: "Not token provider",
    });
  }

  const parts = authHeader.split(" ");

  if (!parts.length === 2) {
    res.status(401).json({
      error: "Token error",
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: "Token not formatted",
    });
  }

  const { JWT_TOKEN } = process.env;

  jwt.verify(token, JWT_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        error: "Token invalid",
      });
    }

    req.userId = decoded.id;

    return next();
  });
};

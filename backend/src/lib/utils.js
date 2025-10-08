import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // in ms
    httpOnly: true, // prevent  XSS attacks : cross-site scripting
    sameSite: "strict", // prevent CSRF attacks
    secure: ENV.NODE_ENV === "production" ? true : false,
  });
};

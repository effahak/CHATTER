import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    //extract token from http-only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket Connection Rejected : No token Provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }
    //verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket Connection Rejected : Invalid Token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    //find user from db
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket Connection Rejected : User Not Found");
      return next(new Error("Unauthorized - User not found"));
    }

    //atttach user info to Socket
    socket.user = user;
    socket.userId = user._id;

    console.log(
      `Socket authenticated for user : ${user.fullName} , ${user._id}`
    );
    next();
  } catch (error) {
    console.log("Error in socketAuth middleware: ", error.message);
    return next(new Error("Unauthorized - Authentication Failed"));
  }
};

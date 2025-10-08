import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    //check if token exists
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized : NO TOKEN PROVIDED " });
    }
    //verify token is valid
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized : Invalid token provided" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    //Check if there's even a user for that token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //put the user details into the req body to be used by the next function
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

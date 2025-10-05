import { error } from "console";
import User from "../models/User.js";
import { generateToken } from "../models/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password too short (< 6 characters)" });
    }
    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    //check if user email matches something in the db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    // hashing password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create newUser
    const newUSer = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUSer) {
      generateToken(newUSer._id, res);
      await newUSer.save();

      res.status(201).json({
        _id: newUSer._id,
        fullName: newUSer.fullName,
        email: newUSer.email,
        profilePic: newUSer.profilePic,
      });
    } else {
      res.status(400).json({ messsage: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

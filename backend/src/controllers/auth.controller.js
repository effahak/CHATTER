import { error } from "console";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

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
      const savedUser = await newUSer.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUSer._id,
        fullName: newUSer.fullName,
        email: newUSer.email,
        profilePic: newUSer.profilePic,
      });

      //send welcome mail
      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Failed to send welcome email ", error);
      }
    } else {
      res.status(400).json({ messsage: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    //check for user
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" }); //never tell the user which one is incorrect
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //verify password
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //user found
    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (_, res) => {
  // res.cookie("jwt", "", { maxAge: 0 }); //another way
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is Required" });
    }

    const userId = req.user._id;

    const uploadedResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadedResponse.secure_url,
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in Profile Update: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

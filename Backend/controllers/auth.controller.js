import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, instructorCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Verify instructor code if registering as instructor
    if (role === "instructor") {
      if (!instructorCode) {
        return res.status(400).json({
          success: false,
          message: "Instructor code is required for instructor registration.",
        });
      }
      if (instructorCode !== process.env.INSTRUCTOR_CODE) {
        return res.status(400).json({
          success: false,
          message: "Invalid instructor code.",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      photoUrl: newUser.photoUrl,
    };

    return generateToken(res, userResponse, "Account created successfully!");
  } catch (error) {
    console.log("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
    };

    return generateToken(res, userResponse, `Welcome back, ${user.name}!`);
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

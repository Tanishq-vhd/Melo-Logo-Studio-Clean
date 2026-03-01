import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* =====================================
    GENERATE JWT TOKEN
===================================== */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* =====================================
    SIGNUP
===================================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, firebaseUid } = req.body;

    if (!name || !email || !password || !firebaseUid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      firebaseUid,
      isPremium: false,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================
    LOGIN
===================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =====================================
    GOOGLE LOGIN / SIGNUP
===================================== */
router.post("/google", async (req, res) => {
  try {
    const { email, name, googleId, firebaseUid } = req.body;

    if (!email || !firebaseUid) {
      return res.status(400).json({ message: "Google authentication failed" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        password: googleId || "google-auth",
        firebaseUid,
        isPremium: false,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
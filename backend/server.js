import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase immediately after loading env variables
import "./Firebase.js"; 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 🚨 CRITICAL: Check keys before proceeding
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ CRITICAL ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in .env");
  process.exit(1);
}

// Import Routes
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";
import generateRoutes from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Update these to match your production domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://melopro.in",
  "https://www.melopro.in",
  "https://melo-logo-studio.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Webhook raw body handling (Must be before express.json())
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// --- 🔄 NEW: USER STATUS UPDATE ROUTE ---
// Use this to manually update a user to "paid" after a successful frontend payment
app.post("/api/payment/update-status", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // This looks into your 'users' collection and sets isPaid to true
    const result = await mongoose.connection.collection("users").findOneAndUpdate(
      { email: email },
      { $set: { isPaid: true, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      // Fallback: Check if using an older version of MongoDB driver
      const userFound = await mongoose.connection.collection("users").findOne({ email });
      if (!userFound) return res.status(404).json({ success: false, message: "User not found" });
      
      await mongoose.connection.collection("users").updateOne({ email }, { $set: { isPaid: true } });
    }

    console.log(`✅ Status updated to PAID for: ${email}`);
    res.json({ success: true, message: "User status updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/generate", generateRoutes);

// Health Check
app.get("/", (req, res) => res.send("🚀 Melo Logo Studio Backend is Live!"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
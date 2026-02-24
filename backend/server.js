import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase immediately after loading env variables
import "./Firebase.js"; 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto"; // Required for Razorpay signature verification

// 🚨 CRITICAL: Check keys before proceeding
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ CRITICAL ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in Render environment");
  process.exit(1);
}

// Import Routes
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";
import generateRoutes from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
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

// Webhook raw body handling (Must be before express.json)
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// --- 🔍 NEW: CHECK STATUS ROUTE ---
// Frontend can call this to see if the user is already paid
app.get("/api/payment/check-status/:email", async (req, res) => {
  try {
    const user = await mongoose.connection.collection("users").findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    res.json({ success: true, isPaid: user.isPaid || false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 🔄 PAYMENT VERIFICATION & STATUS UPDATE ---
app.post("/api/payment/verify-and-upgrade", async (req, res) => {
  const { email, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // 1. Verify Razorpay Signature (Security Check)
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error("❌ Payment verification failed: Invalid Signature");
    return res.status(400).json({ success: false, message: "Payment verification failed." });
  }

  try {
    // 2. Update Database
    const result = await mongoose.connection.collection("users").updateOne(
      { email: email },
      { $set: { isPaid: true, lastPaymentId: razorpay_payment_id, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`✅ User ${email} successfully upgraded to PAID status.`);
    res.json({ success: true, message: "Account upgraded successfully!" });
  } catch (err) {
    console.error("❌ Database update error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/generate", generateRoutes);

// Base Health Check
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
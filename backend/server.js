import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase immediately after loading env variables
import "./Firebase.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";

// 🚨 CRITICAL: Check Razorpay keys before starting
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error(
    "❌ CRITICAL ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing"
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   CORS CONFIG
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://melopro.in",
  "https://www.melopro.in",
  "https://melo-logo-studio.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Webhook raw body handling (MUST be before express.json)
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

/* =========================
   ROUTES IMPORT
========================= */

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";
import generateRoutes from "./routes/generate.js";

/* =========================
   PAYMENT STATUS CHECK
========================= */

app.get("/api/payment/check-status/:email", async (req, res) => {
  try {
    const user = await mongoose.connection
      .collection("users")
      .findOne({ email: req.params.email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      isPremium: user.isPremium || false,
    });
  } catch (err) {
    console.error("Status check error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   PAYMENT VERIFICATION
========================= */

app.post("/api/payment/verify-and-upgrade", async (req, res) => {
  const {
    email,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // 🔐 Verify Razorpay Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error("❌ Payment verification failed: Invalid Signature");
    return res.status(400).json({
      success: false,
      message: "Payment verification failed.",
    });
  }

  try {
    // 🟢 Upgrade user to premium
    const result = await mongoose.connection.collection("users").updateOne(
      { email: email },
      {
        $set: {
          isPremium: true,
          premiumExpiry: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ), // 30 days
          lastPaymentId: razorpay_payment_id,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`✅ User ${email} upgraded to PREMIUM`);

    res.json({
      success: true,
      message: "Account upgraded successfully!",
    });
  } catch (err) {
    console.error("❌ Database update error:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

/* =========================
   USE ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/generate", generateRoutes);

/* =========================
   BASE HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("🚀 Melo Logo Studio Backend is Live!");
});

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Backend running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
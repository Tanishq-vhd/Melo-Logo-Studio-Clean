import dotenv from "dotenv";
dotenv.config();

// Initialize Firebase after env load
import "./Firebase.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";
import generateRoutes from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   ENV VALIDATION
========================= */

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Missing Razorpay keys");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI");
  process.exit(1);
}

/* =========================
   CORS
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

/* =========================
   BODY PARSING
========================= */

// Webhook must use raw body
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/generate", generateRoutes);

/* =========================
   PAYMENT VERIFICATION
========================= */

app.post("/api/payment/verify-and-upgrade", async (req, res) => {
  try {
    const {
      email,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!email || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🔐 Verify Razorpay Signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const usersCollection = mongoose.connection.collection("users");

    let user = await usersCollection.findOne({ email });

    if (!user) {
      // 🔥 Auto create user if not exists
      await usersCollection.insertOne({
        name: "User",
        email,
        isPremium: true,
        premiumExpiry: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ New user created & upgraded: ${email}`);
    } else {
      // Upgrade existing user
      await usersCollection.updateOne(
        { email },
        {
          $set: {
            isPremium: true,
            premiumExpiry: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            lastPaymentId: razorpay_payment_id,
            updatedAt: new Date(),
          },
        }
      );

      console.log(`✅ Existing user upgraded: ${email}`);
    }

    res.json({
      success: true,
      message: "Account upgraded successfully!",
    });

  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
/* =========================
   CHECK PAYMENT STATUS
========================= */

app.get("/api/payment/check-status/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const usersCollection = mongoose.connection.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        isPremium: false,
      });
    }

    // 🔥 ONLY CHECK isPremium
    return res.json({
      success: true,
      isPremium: user.isPremium === true,
    });

  } catch (err) {
    console.error("Status check error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/* =========================
   HEALTH CHECK
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
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
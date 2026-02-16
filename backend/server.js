import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";
import generateRoutes from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* 🔍 ENV CHECK */
console.log("ENV CHECK:", {
  MONGO_URI: process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? "Loaded ✅" : "Missing ❌",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌",
});

/* 🚨 Stop server if critical ENV missing */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

/* 🌐 CORS CONFIG */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://melopro.in",
  "https://www.melopro.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* 🔐 Routes */
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/generate", generateRoutes);

/* 🧪 Health Check */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API running successfully 🚀",
  });
});

/* 🗄️ MongoDB Connection */
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

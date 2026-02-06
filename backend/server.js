import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* 🔍 Debug ENV */
console.log("ENV CHECK:", {
  MONGO_URI: process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? "Loaded ✅" : "Missing ❌",
});

/* 🌐 CORS CONFIG */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://melopro.in",
  "https://www.melopro.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

/* 🔐 Routes */
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);

/* 🧪 Health Check */
app.get("/", (req, res) => {
  res.json({ message: "API running successfully 🚀" });
});

/* 🗄️ MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

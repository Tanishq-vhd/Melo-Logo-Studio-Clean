import dotenv from "dotenv";
dotenv.config(); // Load .env first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* 🔍 Debug ENV (optional) */
console.log("ENV CHECK:", {
  MONGO_URI: process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? "Loaded ✅" : "Missing ❌",
});

/* 🌐 Middleware */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json());

/* 🔐 Routes */
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/payment", paymentRoutes);

/* 🧪 Health check */
app.get("/", (req, res) => {
  res.json({ message: "API running successfully 🚀" });
});

/* 🗄️ MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

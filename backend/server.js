import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🔥 FORCE dotenv FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

// ⬇️ NOW import everything else
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/payment.js";





const app = express();
const PORT = process.env.PORT || 5000;

/* 🌐 Middleware */
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
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
    console.log("MongoDB ready for queries");

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

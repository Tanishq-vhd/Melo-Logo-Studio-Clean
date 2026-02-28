import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/* ================= CREATE ORDER ================= */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {

    // 🔥 If already premium, don't create new order
    if (req.user.isPremium && req.user.premiumExpiry > new Date()) {
      return res.status(400).json({ message: "Already premium" });
    }

    const rzp = getRazorpay();

    const order = await rzp.orders.create({
      amount: 29900,
      currency: "INR",
      receipt: `receipt_${req.user._id}`,
      notes: { userId: req.user._id.toString() },
    });

    res.json(order);

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* ================= VERIFY PAYMENT ================= */
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ Activate premium
    req.user.isPremium = true;
    req.user.premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await req.user.save();

    res.json({ success: true });

  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;
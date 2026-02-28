import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
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
    const user = req.user;

    // 🔒 Prevent duplicate active subscription
    if (
      user.isPremium &&
      user.premiumExpiry &&
      new Date(user.premiumExpiry) > new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "User already has active premium subscription",
      });
    }

    const rzp = getRazorpay();

    const order = await rzp.orders.create({
      amount: 299, // ₹299
      currency: "INR",
      receipt: `receipt_${user._id}`,
      notes: { userId: user._id.toString() },
    });

    return res.json(order);

  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment fields",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ✅ Activate premium for 30 days
    req.user.isPremium = true;
    req.user.premiumExpiry = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await req.user.save();

    return res.json({
      success: true,
      message: "Premium activated successfully",
    });

  } catch (error) {
    console.error("Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

export default router;
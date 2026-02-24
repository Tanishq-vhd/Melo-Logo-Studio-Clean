import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper to get instance ONLY when a route is called
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/* ✅ CREATE ORDER */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const rzp = getRazorpay();
    const options = {
      amount: 29900, // ₹299 (in paise)
      currency: "INR",
      receipt: `receipt_${req.user._id}`,
      notes: { userId: req.user._id.toString() },
    };

    const order = await rzp.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order Error:", error.message);
    res.status(500).json({ message: "Failed to create order" });
  }
});
/* ✅ VERIFY PAYMENT */
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
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ Activate premium
    await User.findByIdAndUpdate(req.user._id, {
      isPremium: true,
      premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Verify Error:", error.message);
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ✅ WEBHOOK (Security Restored) */
router.post("/webhook", async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // 1. Verify Signature (CRITICAL for Security)
    // req.body is a Buffer because of express.raw() in server.js
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body) 
      .digest("hex");
    
    if (expectedSignature !== signature) {
      console.error("❌ Webhook Signature Mismatch!");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2. Parse the verified payload
    const event = JSON.parse(req.body.toString());

    // 3. Handle Payment Captured
    if (event.event === "payment.captured") {
      const userId = event.payload.payment.entity.notes?.userId;
      
      if (userId) {
        // Update user to premium for 30 days
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        
        console.log("✅ Premium successfully activated for user:", userId);
      }
    }

    // Always respond with 200 OK to Razorpay
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    // Respond with 500 so Razorpay knows to retry later
    res.status(500).send("Webhook failed");
  }
});

export default router;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔐 PREMIUM ACCESS FLAG
    isPaid: {
      type: Boolean,
      default: false,
    },

    // 💳 Razorpay payment reference
    paymentId: {
      type: String,
      default: null,
    },

    // 🕒 When payment was completed
    paidAt: {
      type: Date,
      default: null,
    },

    // 📦 Plan type (future-proof)
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent model overwrite error (important in dev / hot reload)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

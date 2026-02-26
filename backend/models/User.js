import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // ✅ Premium fields
    isPremium: {
      type: Boolean,
      default: false,
    },

    premiumExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* 🔐 Hash password before saving (FIXED) */
userSchema.pre("save", async function () {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* 🔑 Compare password */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* ✅ Check if premium is active */
userSchema.methods.isPremiumActive = function () {
  if (!this.isPremium) return false;

  if (this.premiumExpiry && this.premiumExpiry < new Date()) {
    return false;
  }

  return true;
};

const User = mongoose.model("User", userSchema);

export default User;
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
      required: false, // 🔥 Allow Google users without password
      minlength: 6,
    },

    // 🔥 ADD THIS (Very Important)
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      sparse: true, // Allows multiple nulls for non-Google users
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

/* 🔐 Hash password before saving */
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* 🔑 Compare password */
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
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
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
      // Made optional: If a user signs in with Firebase (like Google Sign-In), 
      // they won't have a local password, so this prevents validation crashes.
      required: false, 
      minlength: 6,
    },

    // ✅ ADDED: This is the missing link between Firebase and your database
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // Allows it to be empty for older users who don't have it yet
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
userSchema.pre("save", async function (next) {
  // Only hash if a password actually exists AND is new or modified
  if (!this.password || !this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Added next() to properly move to the next middleware
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
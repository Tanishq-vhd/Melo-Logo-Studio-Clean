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

    // ✅ Premium fields - Matches your manual Compass update
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
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* 🔑 Compare password - Renamed to 'comparePassword' to match auth.js */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* ✅ Check if premium is still valid */
userSchema.methods.isPremiumActive = function () {
  if (!this.isPremium) return false;

  // Auto-expire if the date has passed
  if (this.premiumExpiry && this.premiumExpiry < new Date()) {
    return false; 
  }

  return true;
};

const User = mongoose.model("User", userSchema);

export default User;
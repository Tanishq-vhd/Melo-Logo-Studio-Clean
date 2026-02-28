import admin from "../Firebase.js";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    // 🔥 If not found by firebaseUid, try find by email
    if (!user) {
      user = await User.findOne({ email: decodedToken.email });

      if (user) {
        // Attach firebaseUid to existing user
        user.firebaseUid = decodedToken.uid;
        await user.save();
      }
    }

    // If still no user, create new one
    if (!user) {
      user = await User.create({
        name: decodedToken.name || "User",
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        isPremium: false,
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
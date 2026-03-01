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

    // Find user strictly by firebaseUid
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({
        message: "User not found in database",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
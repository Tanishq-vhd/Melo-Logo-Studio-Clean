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

    if (!user) {
      // 🔥 Try find by email
      user = await User.findOne({ email: decodedToken.email });

      if (user) {
        // Attach firebase UID to existing user
        user.firebaseUid = decodedToken.uid;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name: decodedToken.name || "User",
          email: decodedToken.email,
          firebaseUid: decodedToken.uid,
          isPremium: false,
        });
      }
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default authMiddleware;
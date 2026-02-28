import admin from "../Firebase.js";
import User from "../models/User.js"; // 👈 Make sure this path to your User model is correct

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify the fresh token sent from the frontend
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. Find the actual user document in your MongoDB database
    // ⚠️ IMPORTANT: If your User schema uses a different field name for the Firebase ID, change 'firebaseUid' below!
    // For example, if you save the Firebase UID directly as the MongoDB '_id', use: await User.findById(decodedToken.uid);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // 3. Attach the FULL database user object (which includes .isPremium and .save())
    req.user = user; 
    next();

  } catch (error) {
    console.error("Auth error full:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
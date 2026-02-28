import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify the custom JWT created by your auth.js file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find the exact user using their MongoDB _id
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // 3. Attach the FULL database user object for generate.js to use
    req.user = user; 
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
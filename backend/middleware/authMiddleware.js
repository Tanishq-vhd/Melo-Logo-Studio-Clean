import admin from "../Firebase.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = { _id: decodedToken.uid };
    next();

  } catch (error) {
  console.error("Auth error full:", error);
  return res.status(401).json({ message: "Invalid or expired token" });
}
};

export default authMiddleware;
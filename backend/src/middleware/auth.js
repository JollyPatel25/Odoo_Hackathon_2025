// middleware/auth.js
import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("[AUTH MIDDLEWARE] No Authorization header");
    return res.status(401).json({ message: "Token required" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("[AUTH MIDDLEWARE] Token verified, user:", decoded);
    next();
  } catch (err) {
    console.error("[AUTH MIDDLEWARE] Invalid token:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}

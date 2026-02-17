const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🔍 [AuthMiddleware] Checking authorization...");
  console.log("📌 Request path:", req.path);
  console.log("📌 Auth header present:", !!authHeader);

  if (!authHeader) {
    console.log("❌ No authorization header found");
    return res.status(403).json({ message: "Token missing" });
  }

  console.log("📌 Auth header:", authHeader.substring(0, 50) + "...");

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    console.log("❌ Token not found in header (check Bearer format)");
    return res.status(403).json({ message: "Token not found in header" });
  }

  console.log("📌 Token extracted:", token.substring(0, 30) + "...");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    console.log("✅ Token verified successfully");
    console.log("📌 Decoded data:", decoded);

    // extracted from JWT
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ 
      message: "Invalid token",
      error: err.message 
    });
  }
};

module.exports = authMiddleware;
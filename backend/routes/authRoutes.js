const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const users = require("../data/users");

const SECRET_KEY = "mysecretkey"; // demo only

// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("🔍 [Login] Request received");
  console.log("📌 Credentials:", { username, password });

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    console.log("❌ [Login] User not found or password incorrect");
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  console.log("✅ [Login] User found:", { id: user.id, username: user.username, role: user.role });

  // ✅ JWT created using ID + ROLE
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  console.log("✅ [Login] Token generated successfully");
  console.log("📌 Token preview:", token.substring(0, 50) + "...");
  console.log("📌 Complete response:", { success: true, token, role: user.role, id: user.id });

  return res.json({
    success: true,
    message: "Login successful",
    token,
    role: user.role,
    id: user.id,
  });
});

module.exports = router;
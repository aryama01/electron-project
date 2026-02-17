const express = require("express");
const router = express.Router();
const { login } = require("../controllers/login.controller");

// POST /api/auth/login
router.post("/login", login); // ✅ pass the function directly

module.exports = router;

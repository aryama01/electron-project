const jwt = require("jsonwebtoken");

const SECRET = "super_secret_key"; // move to env later

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: "8h" });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };

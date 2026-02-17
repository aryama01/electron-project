const { verifyToken } = require("../utils/jwt");

function authenticate(token) {
    if (!token) {
        throw new Error("Unauthorized");
    }

    try {
        return verifyToken(token);
    } catch {
        throw new Error("Invalid or Expired Token");
    }
}

module.exports = { authenticate };

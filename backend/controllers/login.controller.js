const { generateToken } = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/password");
const {userModel} = require("../models/user");

// Simulated DB (replace with real DB later)
const users = [
    {
        id: 1,
        username: "mng",
        role: "mng",
        password1: "password" // example hash
    },
    {
        id: 2,
        username: "emp",
        role: "emp",
        password1: "$2b$10$wH6QF1FqWq8kS1rQnPz0Oe6q4P7r0t0eYwz0m9bCqJmG5YkVnT8XK"
    }
];

const loginController = async (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt for username:", username);

    const user = users.find(u => u.username === username);
    console.log("Found user:", user);

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }
    const hashedPassword = await hashPassword(user.password1);
    const isMatch = await comparePassword(password, hashedPassword);

    if ( !(password === user.password1)) {
        return { success: false, message: "Invalid credentials" };
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        username: user.username,
        role: user.role,
        token: token, // optionally JWT if you implement it
        userId: user._id
    });
}

module.exports = { login: loginController };

const { generateToken } = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/password");
const User = require("../models/user");


const loginController = async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt for username:", email);

    const user = await User.findOne({ email: email});
    console.log("Found user:", user);

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }
    const isMatch = await comparePassword(password,user.password);

    if ( !isMatch) {
        return { success: false, message: "Invalid credentials" };
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        username: user.email,
        role: user.role,
        token: token, // optionally JWT if you implement it
        userId: user._id
    });
}

module.exports = { login: loginController };

const { generateToken } = require("../utils/jwt");
const User = require("../models/user");

const login = async (req, res) => {
    const { email, username, password } = req.body;
    console.log(username, email, password);

    const user = await User.findOne({ 
        $or: [{ email }, { username }],
        isDeleted: false 
    }).select('+password');
    console.log(user);

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    await User.findByIdAndUpdate(user._id, { lastActive: new Date() });

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        email: user.email,
        username: user.username,
        role: user.role,
        token,
        userId: user._id
    });
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, changePassword };

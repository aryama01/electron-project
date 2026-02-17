const Employee = require("../models/Employee");
const {hashPassword}= require("../utils/password");

// CREATE EMPLOYEE
const createEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            team,
            role,
            phone,
            department,
            joiningDate,
        } = req.body;
        console.log("📌 Creating employee with data:");

        // Check if employee exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        // Hash password

        const hashedPassword = await hashPassword(password);
        console.log("🔒 Password hashed successfully");

        const employee = await Employee.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            team,
            role,
            phone,
            department,
            joiningDate,
        });
        console.log("✅ Employee created:", employee);

        res.status(201).json({
            message: "Employee created successfully",
            employee,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEmployee,
};

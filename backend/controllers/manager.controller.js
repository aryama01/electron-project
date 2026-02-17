const Manager = require("../models/manager.model");
const managers = require("../data/manager.store");

exports.createManager = (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            department,
            designation,
            employeeId
        } = req.body;

        if (!firstName || !email || !department) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const newManager = new Manager({
            firstName,
            lastName,
            email,
            phone,
            department,
            designation,
            employeeId
        });

        managers.push(newManager);

        res.status(201).json({
            success: true,
            message: "Manager profile saved successfully",
            data: newManager
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

exports.getAllManagers = (req, res) => {
    res.status(200).json({
        success: true,
        data: managers
    });
};

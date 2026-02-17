const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    team: String,
    role: String,
    phone: String,
    department: String,
    joiningDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);

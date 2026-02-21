const employeeService = require('../services/employee.service');

const createEmployee = async (req, res) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json({ message: "Employee created successfully", employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.status(200).json({ count: employees.length, employees });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await employeeService.updateEmployee(req.params.id, req.body);
        res.status(200).json({ message: "Employee updated successfully", employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        await employeeService.deleteEmployee(req.params.id);
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
};
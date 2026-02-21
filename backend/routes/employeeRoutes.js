const express = require("express");
const { createEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require( "../controllers/employeeController.js");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/all", authenticate, getAllEmployees);
router.post("/create", authenticate, authorize('admin', 'manager'), createEmployee);
router.put("/update/:id", authenticate, authorize('admin', 'manager'), updateEmployee);
router.delete("/delete/:id", authenticate, authorize('admin', 'manager'), deleteEmployee);

module.exports = router;
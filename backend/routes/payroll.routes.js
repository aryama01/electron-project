const express = require("express");
const router = express.Router();

const payrollController = require("../controllers/payroll.controller");

// GET /api/payroll
router.get("/", payrollController.getPayrolls);

module.exports = router;

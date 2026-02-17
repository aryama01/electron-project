const express = require("express");
const { createEmployee } = require( "../controllers/employeeController.js");
const authenticate = require( "../middleware/auth.middleware");

const router = express.Router();

router.post("/create",authenticate, createEmployee);

module.exports = router;

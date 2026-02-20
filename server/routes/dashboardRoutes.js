const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.getDashboardStats);
router.get("/tasks", dashboardController.getTaskData);
router.get("/productivity", dashboardController.getProductivityData);
router.get("/distribution", dashboardController.getTaskDistribution);

module.exports = router;
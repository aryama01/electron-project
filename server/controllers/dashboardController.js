// controllers/dashboardController.js

const dashboardService = require("../services/dashboardService");

exports.getDashboardStats = (req, res) => {
  const data = dashboardService.getStats();
  res.json(data);
};

exports.getTaskData = (req, res) => {
  const data = dashboardService.getTaskData();
  res.json(data);
};

exports.getProductivityData = (req, res) => {
  const data = dashboardService.getProductivityData();
  res.json(data);
};

exports.getTaskDistribution = (req, res) => {
  const data = dashboardService.getTaskDistribution();
  res.json(data);
};
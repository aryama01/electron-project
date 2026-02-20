require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const worksheetRoutes = require("./routes/worksheetRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

// ==============================
// Middleware
// ==============================
app.use(cors()); // Allow React frontend to fetch APIs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Connect to MongoDB
// ==============================
connectDB(); // Ensure MONGO_URI in .env is valid

// ==============================
// API Routes
// ==============================
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/worksheets", worksheetRoutes);
app.use("/api/export", exportRoutes);

// ==============================
// Root Route (Health Check)
// ==============================
app.get("/", (req, res) => {
  res.send("Manager Portal API Running ✅");
});

// ==============================
// 404 Handler
// ==============================
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found ❌" });
});

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;

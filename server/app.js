const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./routes/dashboardRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);

module.exports = app;

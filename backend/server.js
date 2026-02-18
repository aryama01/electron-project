// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const managerRoutes = require("./routes/manager.routes");
const loginRoutes = require("./routes/login.routes");
const employeeRoutes = require("./routes/employeeRoutes");
const mailRoutes = require("./routes/mailRoutes");
const payrollRoutes = require("./routes/payroll.routes"); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/managers", managerRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/employee", employeeRoutes);
/* ================= MAIL CENTER ROUTES ================= */
// You can choose to protect with JWT if needed
// Option 1: Protected
// app.use("/api/mail", authMiddleware, mailRoutes);

// Option 2: Public (no JWT required)
app.use("/api/mail", mailRoutes);

// Payroll routes
app.use("/api/payroll", payrollRoutes);

// Test route to confirm server is running
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Start server function
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Atlas Connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    });

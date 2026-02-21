// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const managerRoutes = require("./routes/manager.routes");
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employeeRoutes");
const trackerRoutes = require("./routes/tracker.routes");
const mailRoutes = require("./routes/mailRoutes");
const attendanceRoutes = require("./routes/attendance.routes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const worksheetRoutes = require("./routes/worksheetRoutes");
const exportRoutes = require("./routes/exportRoutes");
const startHeartbeatMonitor = require("./services/heartbeatMonitor");
const registerSocketHandlers = require("./socket"); // NEW (we will create this)

const app = express();
const server = http.createServer(app); // 🔥 REQUIRED for socket.io

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Make io available in routes/controllers
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/managers", managerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/worksheets", worksheetRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
    res.send("Backend + WebSocket is running!");
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log("✅ MongoDB Atlas Connected");

        registerSocketHandlers(io);

        startHeartbeatMonitor();

        server.listen(PORT, () => {
            console.log(`🚀 Server + Socket running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    });
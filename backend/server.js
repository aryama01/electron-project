// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const managerRoutes = require("./routes/manager.routes");
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employeeRoutes");
const trackerRoutes = require("./routes/tracker.routes");
const mailRoutes = require("./routes/mailRoutes");
const attendanceRoutes = require("./routes/attendance.routes");
const Tracker = require("./models/Tracker");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/managers", managerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
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

setInterval(async () => {
    const threshold = new Date(Date.now() - 2 * 60 * 1000);
    await Tracker.updateMany(
        { lastHeartbeat: { $lt: threshold } },
        { status: "offline" }
    );
}, 30000);

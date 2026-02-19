// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const managerRoutes = require("./routes/manager.routes");
const loginRoutes = require("./routes/login.routes");
const employeeRoutes = require("./routes/employeeRoutes");
const trackerRoutes = require("./routes/tracker.routes");
const Tracker = require("./models/Tracker");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/managers", managerRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/tracker", trackerRoutes);


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

//Heartbeat monitoring - set employees to offline if no heartbeat in last 2 minutes
setInterval(async () => {
    const threshold = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes

    await Tracker.updateMany(
        { lastHeartbeat: { $lt: threshold } },
        { status: "offline" }
    );
}, 30000);

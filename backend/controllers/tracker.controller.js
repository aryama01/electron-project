const Tracker = require("../models/Tracker");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.updateStatus = async (req, res) => {
    try {
        const { employeeId, status, activeApp, keyboardActive } = req.body;

        let tracker = await Tracker.findOne({ employeeId });

        if (!tracker) {
            tracker = new Tracker({ employeeId });
        }

        tracker.status = status;
        tracker.activeApp = activeApp;
        tracker.keyboardActive = keyboardActive;
        tracker.lastStatusUpdate = new Date();

        await tracker.save();

        res.json({ message: "Status updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Status update failed" });
    }
};

// HEARTBEAT
exports.heartbeat = async (req, res) => {
    try {
        const { employeeId, activeApp, keyboardActive } = req.body;

        let tracker = await Tracker.findOne({ employeeId });

        if (!tracker) {
            tracker = new Tracker({ employeeId });
        }

        tracker.lastHeartbeat = new Date();
        tracker.activeApp = activeApp;
        tracker.keyboardActive = keyboardActive;

        await tracker.save();

        res.json({ message: "Heartbeat received" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Heartbeat failed" });
    }
};

// Setup storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, "../screenshots");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

exports.upload = multer({ storage });

exports.uploadScreenshot = async (req, res) => {
    try {
        const { employeeId } = req.body;

        res.json({ message: "Screenshot saved" });
    } catch (err) {
        res.status(500).json({ error: "Screenshot upload failed" });
    }
};

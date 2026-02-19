const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "idle", "offline"],
        default: "offline",
    },
    activeApp: String,
    keyboardActive: Boolean,
    lastHeartbeat: Date,
    lastStatusUpdate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Tracker", trackerSchema);

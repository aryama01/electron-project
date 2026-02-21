const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["active", "idle", "offline"],
        default: "offline",
    },
    activeApp: String,
    keyboardActive: Boolean,
    lastHeartbeat: {
        type: Date,
        default: Date.now,
        index: true // keep this
    },
    lastStatusUpdate: Date,
}, { timestamps: true });


module.exports = mongoose.model("Tracker", trackerSchema);
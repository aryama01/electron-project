const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String, // optional (for private chat)
    },
    teamId: {
        type: String, // optional (team chat)
    },
    message: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        default: "text",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Chat", chatSchema);

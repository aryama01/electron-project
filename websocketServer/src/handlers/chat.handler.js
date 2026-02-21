const Chat = require("../models/chat.model");
const { broadcast } = require("../services/clientManager");

async function handleChat(ws, data) {
    try {
        const { message, receiverId, teamId } = data;

        // 1️⃣ Save to database (PERMANENT STORAGE)
        const savedMessage = await Chat.create({
            senderId: ws.userId || ws.clientId,
            receiverId: receiverId || null,
            teamId: teamId || null,
            message,
        });

        // 2️⃣ Broadcast to connected clients (REAL-TIME)
        broadcast({
            type: "chat",
            _id: savedMessage._id,
            message: savedMessage.message,
            senderId: savedMessage.senderId,
            receiverId: savedMessage.receiverId,
            teamId: savedMessage.teamId,
            timestamp: savedMessage.timestamp,
        });

    } catch (error) {
        console.error("Chat Save Error:", error);
    }
}

module.exports = { handleChat };

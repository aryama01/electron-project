const Tracker = require("./models/Tracker");

function registerSocketHandlers(io) {
    io.on("connection", (socket) => {
        console.log("🔌 Client connected:", socket.id);

        // HEARTBEAT EVENT (from Electron tracker)
        socket.on("heartbeat", async (data) => {
            try {
                const { userId, activeApp, keyboardActive } = data;
                console.log(userId);

                if (!userId) return;

                await Tracker.findOneAndUpdate(
                    { UserID: userId },
                    {
                        activeApp,
                        keyboardActive,
                        status: keyboardActive ? "active" : "idle",
                        lastHeartbeat: new Date(),
                        lastStatusUpdate: new Date(),
                    },
                    {
                        upsert: true,
                        returnDocument: "after",
                    }
                );
            } catch (error) {
                console.error("Heartbeat socket error:", error.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });
}

module.exports = registerSocketHandlers;
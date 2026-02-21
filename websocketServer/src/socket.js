const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { addClient, removeClient, broadcast } = require("./services/clientManager");
const { handleChat } = require("./handlers/chat.handler");
const { handleHeartbeat } = require("./handlers/heartbeat.handler");
const { handlePresence } = require("./handlers/presence.handler");
const { handleTyping } = require("./handlers/typing.handler");

function setupWebSocket(server) {
    const wss = new WebSocket.Server({
        server,
        perMessageDeflate: false,
    });

    wss.on("connection", (ws, req) => {
        const clientId = uuidv4();
        ws.clientId = clientId;
        ws.isAlive = true;

        addClient(clientId, ws);

        console.log(`🟢 Client Connected: ${clientId}`);

        // Notify presence
        handlePresence(clientId, "online");

        ws.on("message", (raw) => {
            try {
                const data = JSON.parse(raw.toString());

                switch (data.type) {
                    case "chat":
                        handleChat(ws, data);
                        break;

                    case "heartbeat":
                        handleHeartbeat(ws);
                        break;

                    case "typing":
                        handleTyping(ws, data);
                        break;

                    case "register":
                        ws.userId = data.userId; // map employee ID
                        break;

                    default:
                        console.log("Unknown event:", data.type);
                }
            } catch (err) {
                console.error("Invalid WS message:", err);
            }
        });

        ws.on("close", () => {
            console.log(`Client Disconnected: ${clientId}`);
            removeClient(clientId);
            handlePresence(clientId, "offline");
        });

        ws.on("pong", () => {
            ws.isAlive = true;
        });
    });

    // Global heartbeat checker (detect crashes/offline apps)
    setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                console.log(` Terminating dead client: ${ws.clientId}`);
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);
}

module.exports = { setupWebSocket };

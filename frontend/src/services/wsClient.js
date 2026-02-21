let socket = null;
let heartbeatInterval = null;

export const connectWS = (userId, handlers = {}) => {
    if (socket && socket.readyState === WebSocket.OPEN) return socket;

    socket = new WebSocket("ws://localhost:5000"); // change port if needed

    socket.onopen = () => {
        console.log("🟢 Connected to WS server");

        // 🔥 REGISTER user (VERY IMPORTANT for your backend)
        socket.send(
            JSON.stringify({
                type: "register",
                userId: userId,
            })
        );

        // Start heartbeat (your server expects it)
        heartbeatInterval = setInterval(() => {
            sendWS({ type: "heartbeat" });
        }, 25000);
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            // Route events based on type
            if (handlers.onChat && data.type === "chat") {
                handlers.onChat(data);
            }

            if (handlers.onPresence && data.type === "presence") {
                handlers.onPresence(data);
            }

            if (handlers.onTyping && data.type === "typing") {
                handlers.onTyping(data);
            }
        } catch (err) {
            console.error("WS parse error:", err);
        }
    };

    socket.onclose = () => {
        console.log("🔴 WS Disconnected");
        clearInterval(heartbeatInterval);

        // Auto reconnect (important for Electron tracker apps)
        setTimeout(() => connectWS(userId, handlers), 3000);
    };

    socket.onerror = (err) => {
        console.error("WS Error:", err);
    };

    return socket;
};

export const sendWS = (payload) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
    } else {
        console.warn("Socket not connected");
    }
};
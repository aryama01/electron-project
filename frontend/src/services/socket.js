import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // your REST + WS server

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
});

// Start heartbeat (DEV version using browser activity)
export const startHeartbeat = (userId) => {
    if (!userId) return;


    setInterval(() => {
        socket.emit("heartbeat", {
            userId,
            activeApp: "Web App (Dev Mode)",
            keyboardActive: document.hasFocus(), // simulate activity
            timestamp: new Date(),
        });
    }, 20000); // 20 sec
};
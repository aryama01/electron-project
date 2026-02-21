// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // 🔐 Login
    loginController: (credentials) =>
        ipcRenderer.invoke("login", credentials),

    // 👀 Listen for status updates (active / idle / offline)
    onStatusChange: (callback) =>
        ipcRenderer.on("status-changed", (_, status) => callback(status)),

    // 🚪 Optional: Check Out
    checkOut: () => ipcRenderer.send("check-out")
});

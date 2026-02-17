// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    loginController: (credentials) => ipcRenderer.invoke("login", credentials)
});

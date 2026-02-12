const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendLogin: (data) => ipcRenderer.send('login', data)
});

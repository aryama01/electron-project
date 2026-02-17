const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        autoHideMenuBar: true,
        backgroundColor: "#f4f6f9",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.maximize();


    // Load the login page first
    mainWindow.loadFile('login.html');
}
ipcMain.on("login", (event, data) => {

    const { username, password } = data;

    if (username === "mng" && password === "password") {
        mainWindow.loadFile(
            path.join(__dirname, "frontend", "dist", "index.html")
        );
    }

    else if (username === "emp" && password === "password") {
        mainWindow.loadFile("employee.html");
    }
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

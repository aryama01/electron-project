// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");


let mainWindow;
let authSession = null; // 🔐 Secure in-memory session

async function createWindow() {
        mainWindow = new BrowserWindow({
        width: 1280,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        autoHideMenuBar: true,
        backgroundColor: "#f4f6f9",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.maximize();
    mainWindow.webContents.openDevTools();

    mainWindow.loadFile("login.html");
}

ipcMain.handle("login", async (event, credentials) => {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
            username: credentials.username,
            password: credentials.password
        });
        console.log(res);

        const data = res.data;

        if (!data.success) {
            return data; // will trigger error display in login.html
        }

        // Store session in memory (optional)
        global.authSession = { token: data.token, role: data.role, userId: data.userId };

        // Navigate based on role
        if (data.role === "mng") {
            mainWindow.loadFile(
                path.join(__dirname,"..", "frontend", "dist", "index.html")
            );
        } else if (data.role === "emp") {
            event.sender.loadFile("employee.html");
        } else {
            event.sender.loadFile("login.html");
        }

        return data;

    } catch (err) {
        console.error("Login failed:", err.message);
        return { success: false, message: err.message || "Login failed" };
    }
});

// App ready
app.whenReady().then(createWindow);

// Quit app when all windows closed
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// macOS: re-create window on dock icon click
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

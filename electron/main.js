// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const { spawn } = require("child_process"); // For launching .NET tracker
// const iohook = require("iohook"); // Optional if using JS global hook

let mainWindow;
let idleTimer = null;
let currentStatus = "offline";
let isCheckedIn = true;
let authSession = null;
let trackerProcess = null;
let isTrackerRunning = false;

const IDLE_TIME = 5 * 60 * 1000; // 5 minutes

// ===============================
// WINDOW CREATION
// ===============================
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
    startTracker();
}

// ===============================
// STATUS UPDATE FUNCTION
// ===============================
async function updateStatus(newStatus) {
    if (!authSession) return;
    if (currentStatus === newStatus) return;

    currentStatus = newStatus;

    console.log("Status changed to:", newStatus);

    try {
        await axios.post(
            "http://localhost:5000/api/employee/status",
            {
                employeeId: authSession.userId,
                status: newStatus
            },
            {
                headers: {
                    Authorization: `Bearer ${authSession.token}`
                }
            }
        );
    } catch (err) {
        console.error("Status sync failed:", err.message);
    }

    if (mainWindow) {
        mainWindow.webContents.send("status-changed", newStatus);
    }
}

// ===============================
// IDLE TIMER RESET (JS fallback)
// ===============================
function resetIdleTimer() {
    if (!isCheckedIn) return;

    if (idleTimer) clearTimeout(idleTimer);

    if (currentStatus === "idle") {
        updateStatus("active");
    }

    idleTimer = setTimeout(() => {
        updateStatus("idle");
    }, IDLE_TIME);
}
function startTracker() {
    if (isTrackerRunning) {
        console.log("Tracker already running, skipping...");
        return;
    }

    const trackerPath = path.join(__dirname, "tracker", "ActivityTracker.exe");
    console.log("Starting tracker at:", trackerPath);

    try {
        trackerProcess = spawn(trackerPath, [], {
            detached: false, // ❗ IMPORTANT: false for reliable kill on Windows
            stdio: "ignore",
            windowsHide: true // 🔥 Hide background window
        });

        isTrackerRunning = true;

        trackerProcess.on("spawn", () => {
            console.log("Tracker process started. PID:", trackerProcess.pid);
        });

        trackerProcess.on("exit", (code) => {
            console.log("Tracker exited with code:", code);
            trackerProcess = null;
            isTrackerRunning = false;
        });

        trackerProcess.on("error", (err) => {
            console.error("Failed to start tracker:", err.message);
            trackerProcess = null;
            isTrackerRunning = false;
        });

    } catch (err) {
        console.error("Tracker launch error:", err.message);
    }
}
function stopTracker() {
    if (!trackerProcess) {
        console.log("No tracker process to stop.");
        return;
    }

    try {
        console.log("Stopping tracker process...");

        // Kill the process safely
        trackerProcess.kill();

        trackerProcess = null;
        isTrackerRunning = false;

        console.log("Tracker stopped successfully.");
    } catch (err) {
        console.error("Error stopping tracker:", err.message);
    }
}

// 🔴 Stop tracker when Electron quits
app.on("before-quit", () => {
    console.log("App quitting...");
    stopTracker(); // Use centralized stop logic
});


ipcMain.handle("login", async (event, credentials) => {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
            username: credentials.username,
            password: credentials.password
        });

        const data = res.data;

        if (!data.success) {
            return data;
        }

        authSession = {
            token: data.token,
            role: data.role,
            userId: data.userId
        };

        // Start tracking AFTER login for employees
        if (data.role === "emp") {
            isCheckedIn = true;
            updateStatus("active");
            resetIdleTimer();
            startTracker(); // launch .NET tracker
        }

        // Navigate
        if (data.role === "mng") {
            mainWindow.loadFile(
                path.join(__dirname, "..", "frontend", "dist", "index.html")
            );
        } else if (data.role === "emp") {
            mainWindow.loadFile("employee.html");
        } else {
            mainWindow.loadFile("login.html");
        }

        return data;

    } catch (err) {
        console.error("Login failed:", err.message);
        return { success: false, message: err.message || "Login failed" };
    }
});


// CHECK OUT HANDLER
ipcMain.on("check-out", () => {
    isCheckedIn = false;
    updateStatus("offline");
    stopTracker(); // stop .NET tracker
});


// APP EVENTS
app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

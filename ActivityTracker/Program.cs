const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory employee store
const employees = {};

// Screenshot storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "screenshots");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },    
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ==========================
// STATUS ENDPOINT
// ==========================
app.post("/status", (req, res) => {
  const { employeeId, status, activeApp, keyboardActive, timestamp } = req.body;

  if (!employeeId) return res.status(400).json({ error: "employeeId required" });

  if (!employees[employeeId]) {
    employees[employeeId] = {};
  }

  employees[employeeId].status = status;
  employees[employeeId].activeApp = activeApp;
  employees[employeeId].keyboardActive = keyboardActive;
  employees[employeeId].lastUpdate = Date.now();

  console.log("STATUS:", employeeId, status, activeApp);

  res.json({ message: "Status received" });
});

// ==========================
// HEARTBEAT ENDPOINT
// ==========================
app.post("/heartbeat", (req, res) => {
  const { employeeId, activeApp, keyboardActive } = req.body;

  if (!employeeId) return res.status(400).json({ error: "employeeId required" });

  if (!employees[employeeId]) {
    employees[employeeId] = {};
  }

  employees[employeeId].lastHeartbeat = Date.now();
  employees[employeeId].activeApp = activeApp;
  employees[employeeId].keyboardActive = keyboardActive;

  console.log("HEARTBEAT:", employeeId);

  res.json({ message: "Heartbeat received" });
});

// ==========================
// SCREENSHOT ENDPOINT
// ==========================
app.post("/screenshot", upload.single("screenshot"), (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) return res.status(400).json({ error: "employeeId required" });

  console.log("SCREENSHOT:", employeeId, req.file.filename);

  res.json({ message: "Screenshot saved" });
});

// ==========================
// GET EMPLOYEE STATUS
// ==========================
app.get("/employees", (req, res) => {
  res.json(employees);
});

// ==========================
// Auto Offline Detection
// ==========================
setInterval(() => {
  const now = Date.now();

  Object.keys(employees).forEach((id) => {
    const lastHeartbeat = employees[id].lastHeartbeat || 0;

    if (now - lastHeartbeat > 2 * 60 * 1000) {
      employees[id].status = "offline";
    }
  });
}, 30000); // check every 30 sec

// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Tracker backend running on http://localhost:${PORT}`);
});

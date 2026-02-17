const express = require("express");
const cors = require("cors");

<<<<<<< HEAD
const payrollRoutes = require("./routes/payroll.routes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 5000;
=======
const managerRoutes = require("./routes/manager.routes");

const app = express();
>>>>>>> main

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// 🔍 Simple request logger (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* ================= AUTH ROUTES ================= */
// Login route → /api/login
app.use("/api", authRoutes);

/* ================= PROTECTED ROUTES ================= */

// App entry route (JWT protected)
app.get("/api/app", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to the app",
    userId: req.userId,
    role: req.role,
  });
});

// Payroll routes (JWT protected)
app.use("/api/payroll", authMiddleware, payrollRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("Payroll Backend is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
=======
app.use("/api/managers", managerRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
>>>>>>> main

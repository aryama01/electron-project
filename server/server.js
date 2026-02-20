require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// ==============================
// Set Port
// ==============================
const PORT = process.env.PORT || 5000;

// ==============================
// Connect Database
// ==============================
connectDB();

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

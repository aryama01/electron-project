const express = require("express");
const cors = require("cors");

const managerRoutes = require("./routes/manager.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/managers", managerRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

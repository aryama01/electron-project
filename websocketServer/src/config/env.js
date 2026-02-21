require("dotenv").config();

module.exports = {
    PORT: process.env.WS_PORT || 4001,
    HEARTBEAT_INTERVAL: Number(process.env.HEARTBEAT_INTERVAL) || 30000,
    CLIENT_TIMEOUT: Number(process.env.CLIENT_TIMEOUT) || 60000,
    NODE_ENV: process.env.NODE_ENV || "development",
};

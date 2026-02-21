const { broadcast } = require("../services/clientManager");

function handlePresence(clientId, status) {
    broadcast({
        type: "presence",
        clientId,
        status,
        timestamp: new Date().toISOString(),
    });
}

module.exports = { handlePresence };

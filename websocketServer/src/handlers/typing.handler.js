const { broadcast } = require("../services/clientManager");

function handleTyping(ws, data) {
    broadcast({
        type: "typing",
        userId: ws.userId || ws.clientId,
    }, ws.clientId);
}

module.exports = { handleTyping };

const clients = new Map(); // clientId -> ws
const userMap = new Map(); // userId -> clientId

function addClient(clientId, ws, userId = null) {
    clients.set(clientId, ws);
    if (userId) userMap.set(userId, clientId);
}

function removeClient(clientId) {
    for (const [userId, cId] of userMap.entries()) {
        if (cId === clientId) userMap.delete(userId);
    }
    clients.delete(clientId);
}

function getAllClients() {
    return clients;
}

function broadcast(data, excludeId = null) {
    const message = JSON.stringify(data);

    clients.forEach((client, id) => {
        if (id !== excludeId && client.readyState === 1) {
            client.send(message);
        }
    });
}

module.exports = {
    addClient,
    removeClient,
    getAllClients,
    broadcast,
};

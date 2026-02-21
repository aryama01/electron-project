const http = require("http");
const { PORT } = require("./config/env");
const { setupWebSocket } = require("./socket");
const connectDB = require("./db/connect");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("WebSocket Microservice Running");
});

connectDB();

setupWebSocket(server);

server.listen(PORT, () => {
    console.log(` WebSocket Server running on port ${PORT}`);
});

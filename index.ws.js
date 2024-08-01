const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Server is running on port 3000");
});

/* Begin websocket */
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log(`Number of clients: ${numClients}`);

  wss.broadcast(`Number of clients: ${numClients}`);

  if (ws.readyState === ws.OPEN) ws.send("Hello from server");

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

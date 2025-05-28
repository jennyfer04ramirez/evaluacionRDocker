const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();

const wss = new WebSocket.Server({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);

    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch (err) {
      console.error("Mensaje inválido (no es JSON):", message.toString());
      return;
    }

    const broadcast = JSON.stringify(parsed);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(broadcast);
      }
    });
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

server.listen(8080, () => {
  console.log("Servidor WebSocket escuchando en ws://localhost:8080/ws");
});

const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const hostname = '127.0.0.1';
const port = 4000;

app.use(cors({ origin: '*' }));

const races = ['goblin', 'orc', 'troll'];

app.get('/return-monster', (req, res) => {
  const monster = {
    race: races[Math.floor(Math.random() * races.length)],
    strength: Math.floor(Math.random() * 5) + 3,
    stamina: Math.floor(Math.random() * 20) + 30,
  };

  res.status(200).json(monster);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  const interval = setInterval(() => {
    if (Math.random() < 0.2) {
      const event = {
        type: 'BUFF',
        strengthBoost: Math.random() < 0.5 ? 2 : 0,
        staminaBoost: Math.random() < 0.5 ? 5 : 0,
      };
      ws.send(JSON.stringify(event));
    }
  }, 3000);

  ws.on('close', () => clearInterval(interval));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});

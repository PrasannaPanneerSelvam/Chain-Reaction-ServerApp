const express = require('express');
const http = require('http');
const { Server, Socket } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static('./frontend'));

io.on('connection', socket => {
  console.log('New user connected!!!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/ChainReaction.html'));
});

app.get('*', (req, res) => {
  res.status(404).send('Page not found!');
});

app.use((req, res) => {
  res.sendStatus(500);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

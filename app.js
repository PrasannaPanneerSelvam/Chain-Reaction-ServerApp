const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// TODO :: Restrict the client url
const io = new Server(server, { cors: { origin: '*' } });

const setSocketEvents = require('./src/SocketEventsHandler');

app.use(express.static('./frontend'));

io.on('connection', socket => {
  console.log('New user connected!!!');
  setSocketEvents(socket, io);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/ChainReaction.html'));
});

/*********** Error Handling ************/
app.get('*', (req, res) => res.status(404).send('Page not found!'));
app.use((req, res) => res.sendStatus(500));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

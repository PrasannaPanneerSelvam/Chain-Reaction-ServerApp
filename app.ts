import path from 'path';
import http from 'http';
import express from 'express';
import { Server, Socket } from 'socket.io';
import setSocketEvents from './src/SocketEventsHandler';

const app = express();
const server = http.createServer(app);

// TODO :: Restrict the client url
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static('./frontend'));

io.on('connection', (socket: Socket) => {
  console.log('New user connected!!!');
  setSocketEvents(socket, io);
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './frontend/ChainReaction.html'));
});

/*********** Error Handling ************/
app.get('*', (_, res) => res.status(404).send('Page not found!'));
app.use((_, res) => res.sendStatus(500));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

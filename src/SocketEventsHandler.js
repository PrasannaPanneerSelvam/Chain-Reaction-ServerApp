const { createAndJoinNewRoom, joinRoom } = require('./RoomHandler');

function addSocketEvents(socket, io) {
  /************** Room entry events **************/
  socket.on('create-room', (noOfPlayers = 4) => {
    const result = createAndJoinNewRoom(noOfPlayers);
    socket.emit('gameDetails', result);
  });

  socket.on('join-room', (roomId, jwt) => {
    const result = joinRoom(roomId, jwt);
    socket.emit('gameDetails', result);
  });

  /************** Game events **************/
  socket.on('m', message => {
    socket.broadcast.emit('m', message);
  });
}

module.exports = addSocketEvents;

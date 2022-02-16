const { createAndJoinNewRoom, joinRoom } = require('./RoomHandler');

function addSocketEvents(socket, io) {
  /************** Room entry events **************/
  socket.on('create-room', (noOfPlayers = 4) => {
    const result = createAndJoinNewRoom(noOfPlayers);
    socket.emit('gameDetails', result);
  });

  socket.on('join-room', (roomId, jwt) => {
    let result = null;
    try {
      result = joinRoom(roomId, jwt);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    } finally {
      socket.emit('gameDetails', result);
    }
  });

  /************** Game events **************/
  socket.on('m', message => {
    socket.broadcast.emit('m', message);
  });
}

module.exports = addSocketEvents;

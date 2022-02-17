const { createAndJoinNewRoom, joinRoom } = require('./RoomHandler');

function addSocketEvents(socket, io) {
  /************** Room entry events **************/
  socket.on('create-room', (noOfPlayers = 4) => {
    let result = null;
    try {
      result = createAndJoinNewRoom(noOfPlayers);
      setRoomEvents(socket, result.roomId);
      socket.emit('gameDetails', result);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    }
  });

  socket.on('join-room', (roomId, jwt) => {
    let result = null;
    try {
      result = joinRoom(roomId, jwt);
      setRoomEvents(socket, result.roomId);
      socket.emit('gameDetails', result);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    }
  });
}

function setRoomEvents(socket, roomId) {
  /************** Game events **************/
  socket.on('m', message => {
    socket.to(roomId).emit('m', message);
  });
}

module.exports = addSocketEvents;

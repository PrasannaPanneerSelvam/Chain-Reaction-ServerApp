const { createRandomHexId } = require('./Utils/MathUtils');
const { Room, Client } = require('./Models');

// TODO :: Make the arcjitecture serverless
const RoomMap = {};

function createRoom(noOfPlayers) {
  let newRoomId;
  do {
    newRoomId = createRandomHexId();
  } while (RoomMap[newRoomId]);

  RoomMap[newRoomId] = new Room(noOfPlayers);
  return newRoomId;
}

// jwtToken - To handle player rejoin in case of app close or network issues
function joinRoom(roomId, jwtToken = null, joinAnnouncement) {
  const room = RoomMap[roomId],
    playerId = room.getNextIndex(),
    newClient = new Client(playerId, jwtToken);

  const isPlayer = room.addClient(newClient);
  newClient.setClientType(isPlayer);

  joinAnnouncement && joinAnnouncement(newClient);

  return {
    roomDetails: room.getRoomDetails(roomId),
    playerId,
    isPlayer,
  };
}

function createAndJoinNewRoom(noOfPlayers) {
  const newRoomId = createRoom(noOfPlayers);
  return joinRoom(newRoomId);
}

module.exports = { createAndJoinNewRoom, joinRoom };

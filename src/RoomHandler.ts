import { createRandomHexId } from './Utils/MathUtils';
import { GameClient, Room, RoomDetails, PlayerDetails } from './Models';

interface PlayerRoomReponse {
  roomDetails: RoomDetails;
  playerId: number;
  isPlayer: boolean;
}

// TODO :: Make the architecture serverless
const RoomMap: { [key: string]: Room } = {};

function createRoom(noOfPlayers: number): string {
  let newRoomId: string;
  do {
    newRoomId = createRandomHexId();
  } while (RoomMap[newRoomId]);

  RoomMap[newRoomId] = new Room(noOfPlayers);
  return newRoomId;
}

// jwtToken - To handle player rejoin in case of app close or network issues
function joinRoom(
  roomId: string,
  jwtToken?: null | string,
  joinAnnouncement?: (roomId: string, client: PlayerDetails) => void
): [Room, PlayerRoomReponse] {
  const room: any = RoomMap[roomId],
    playerId: number = room.getNextIndex(),
    newClient: GameClient = new GameClient(playerId, jwtToken);

  const isPlayer: boolean = room.addClient(newClient);
  newClient.setClientType(isPlayer == null ? false : isPlayer);

  joinAnnouncement && joinAnnouncement(roomId, newClient.getPlayerDetails());

  return [
    room,
    {
      roomDetails: room.getRoomDetails(roomId),
      playerId,
      isPlayer,
    },
  ];
}

function createAndJoinNewRoom(noOfPlayers: number): [Room, PlayerRoomReponse] {
  const newRoomId = createRoom(noOfPlayers);
  return joinRoom(newRoomId, null);
}

export { PlayerRoomReponse, createAndJoinNewRoom, joinRoom };

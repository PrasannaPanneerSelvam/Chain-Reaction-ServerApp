import { Socket, Server } from 'socket.io';

import { PlayerDetails } from './Models';
import { createAndJoinNewRoom, joinRoom } from './RoomHandler';

function addSocketEvents(socket: Socket, io: Server): void {
  /************** Room entry events **************/
  socket.on('create-room', (noOfPlayers = 4) => {
    let result = null;
    try {
      result = createAndJoinNewRoom(noOfPlayers);
      socket.join(result.roomDetails.roomId);
      setRoomEvents(socket, result.roomDetails.roomId);
      socket.emit('gameDetails', result);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    }
  });

  socket.on('join-room', (roomId: string, jwt: string) => {
    let result = null;
    try {
      result = joinRoom(roomId, jwt, (roomId: string, client: PlayerDetails) =>
        socket.to(roomId).emit('player', client)
      );
      socket.join(result.roomDetails.roomId);
      setRoomEvents(socket, result.roomDetails.roomId);
      socket.emit('gameDetails', result);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    }
  });
}

function setRoomEvents(socket: Socket, roomId: string): void {
  /************** Game events **************/
  socket.on('m', (message: number) => {
    socket.to(roomId).emit('m', message);
  });
}

export default addSocketEvents;

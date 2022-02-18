import { Socket, Server } from 'socket.io';

import { PlayerDetails, Room } from './Models';
import {
  PlayerRoomReponse,
  createAndJoinNewRoom,
  joinRoom,
} from './RoomHandler';

function addSocketEvents(socket: Socket, io: Server): void {
  /************** Room entry events **************/
  socket.on('create-room', (noOfPlayers = 4) => {
    let result: PlayerRoomReponse | string, room: Room;
    try {
      [room, result] = createAndJoinNewRoom(noOfPlayers);
      socket.join(result.roomDetails.roomId);
      setRoomEvents(socket, room, result.roomDetails.roomId, result.playerId);
      socket.emit('gameDetails', result);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    }
  });

  socket.on('join-room', (roomId: string, jwt: string) => {
    let result: PlayerRoomReponse | string, room: Room;
    try {
      [room, result] = joinRoom(
        roomId,
        jwt,
        (roomId: string, client: PlayerDetails) =>
          socket.to(roomId).emit('player', client)
      );
      socket.join(result.roomDetails.roomId);
      setRoomEvents(socket, room, result.roomDetails.roomId, result.playerId);
      socket.emit('gameDetails', result);
    } catch (e) {
      // TODO :: Make the error message more specific to content
      result = 'Unable to find room id';
    }
  });
}

function setRoomEvents(
  socket: Socket,
  room: Room,
  roomId: string,
  playerId: number
): void {
  let gameOver = false;

  const cellUpdateCallback = () => {};

  const performMove = (move: number) => {
    const isValidMove = room.validateMove(playerId, move, {
      cellUpdateCallback,
      playerOut,
      playerWins,
    });

    if (gameOver) {
      return;
    }

    if (isValidMove) {
      socket.to(roomId).emit('m', move);
    } else {
      // TODO :: Return board values to correct the player's UI
      socket.emit('no-cheating', [0, 0, 0, 0]);
    }
  };

  function playerWins(playerNumber: number) {
    gameOver = true;
    socket.in(roomId).emit('w', playerNumber);
  }

  function playerOut(playerNumber: number) {
    socket.in(roomId).emit('l', playerNumber);
    socket.off('m', performMove);
  }

  /************** Game events **************/
  socket.on('m', performMove);
}

export default addSocketEvents;

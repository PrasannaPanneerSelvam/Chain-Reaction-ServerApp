import GameClient, { PlayerDetails } from './GameClient';
import ChainReaction, { FeedbackCallbacks } from './GameEngine';
import PlayerRotation from './PlayerRotationUtils';

interface RoomDetails {
  roomId: string;
  noOfPlayers: number;
  players: PlayerDetails[];
  board: number[];
  noOfWatchers: number;
}

class Room {
  readonly totalClients: number;

  private maxNumberOfPlayers: number;
  private currentClientsCount: number;
  private validationBoard: ChainReaction;
  private playerRotation: PlayerRotation;

  players: GameClient[];
  watchers: GameClient[];

  constructor(noOfPlayers: number) {
    this.totalClients = 10; // Players + Watchers
    this.maxNumberOfPlayers = noOfPlayers; // Max 4 for now
    this.players = [];
    this.watchers = [];

    // To avoid conflicts between watchers & players lose
    this.currentClientsCount = 0;

    // TODO :: Add server validation functionality
    this.validationBoard = new ChainReaction(8, 8, noOfPlayers);
    this.playerRotation = new PlayerRotation(noOfPlayers);
  }

  addClient(newClient: GameClient): boolean {
    if (this.currentClientsCount < this.maxNumberOfPlayers) {
      this.players.push(newClient);
      this.currentClientsCount++;
      return true;
    }

    if (this.currentClientsCount < this.totalClients) {
      this.watchers.push(newClient);
      this.currentClientsCount++;
      return false;
    }

    // TODO :: Handle exceeding clients
    return false;
  }

  getNextIndex(): number {
    return this.currentClientsCount;
  }

  /********************* Converting 2d matrix values to 1d array ***************************/
  getBoardValues(): number[] {
    const board = this.validationBoard.getBoard(),
      result: number[] = [];

    for (let row = 0, idx = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++, idx++) {
        const value = board[row][col].value,
          color = board[row][col].color;
        result.push(value === 0 ? 0 : color * 10 + value);
      }
    }

    return result;
  }

  // TODO :: Implement this to show player details & game board
  getRoomDetails(roomId: string): RoomDetails {
    return {
      roomId,
      noOfPlayers: this.maxNumberOfPlayers,
      players: this.players.map(player => player.getPlayerDetails()),
      board: this.getBoardValues(),
      noOfWatchers: this.watchers.length,
    };
  }

  validateMove(
    playerId: number,
    move: number,
    callBackObject: FeedbackCallbacks
  ): boolean {
    const row = Math.floor(move / 8),
      col = move % 8;

    if (this.playerRotation.getCurrentPlayer() !== playerId) {
      return false;
    }

    const playerOutCb = callBackObject.playerOut;
    callBackObject.playerOut = (playerId: number) => {
      this.playerRotation.removePlayer(playerId);
      playerOutCb(playerId);
    };

    const isValidMove = this.validationBoard.addNucleus(
      row,
      col,
      playerId,
      callBackObject
    );

    if (isValidMove) {
      this.playerRotation.updateNextPlayer();
    }

    return isValidMove;
  }
}

export default Room;

export { RoomDetails };

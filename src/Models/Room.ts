import GameClient, { PlayerDetails } from './GameClient';

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
  private validationBoard: null;

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
    this.validationBoard = null;
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

  // TODO :: Convert 2d matrix values to 1d array
  getBoardValues(): number[] {
    return [];
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
}

export default Room;

export { RoomDetails };

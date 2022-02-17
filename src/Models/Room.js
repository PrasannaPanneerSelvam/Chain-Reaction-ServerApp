class Room {
  // __maxNumberOfPlayers;
  // __totalClients;
  // __currentClientsCount;

  constructor(noOfPlayers) {
    this.__maxNumberOfPlayers = noOfPlayers; // Max 4 for now
    this.__totalClients = 10; // Players + Watchers
    this.players = [];
    this.watchers = [];

    // To avoid conflicts between watchers & players lose
    this.__currentClientsCount = 0;

    // TODO :: Add server validation functionality
    this.__validationBoard = null;
  }

  addClient(newClient) {
    if (this.__currentClientsCount < this.__maxNumberOfPlayers) {
      this.players.push(newClient);
      this.__currentClientsCount++;
      return true;
    }

    if (this.__currentClientsCount < this.__totalClients) {
      this.watchers.push(newClient);
      this.__currentClientsCount++;
      return false;
    }

    // TODO :: Handle exceeding clients
    return null;
  }

  getNextIndex() {
    return this.__currentClientsCount;
  }

  // TODO :: Convert 2d matrix values to 1d array
  getBoardValues() {

  }

  // TODO :: Implement this to show player details & game board
  getRoomDetails(roomId) {
    return {
      roomId,
      noOfPlayers: this.__maxNumberOfPlayers,
      players: this.players.map(player => player.getPlayerDetails()),
      board: this.getBoardValues(),
      noOfWatchers: this.watchers.length,
    }
  }
}

module.exports = Room;

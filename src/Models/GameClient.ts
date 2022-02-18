interface PlayerDetails {
  playerNumber: number;
}

class GameClient {
  playerNumber: number;
  jwt?: string | null;
  isPlayer: boolean;

  constructor(playerNumber: number, jwt?: string | null) {
    this.playerNumber = playerNumber;
    this.jwt = null;
    this.isPlayer = false;
  }

  setClientType(isPlayer: boolean) {
    this.isPlayer = isPlayer === true;
  }

  getPlayerDetails(): PlayerDetails {
    const result: PlayerDetails = {
      playerNumber: this.playerNumber,
    };

    return result;
  }
}

export default GameClient;

export { PlayerDetails };

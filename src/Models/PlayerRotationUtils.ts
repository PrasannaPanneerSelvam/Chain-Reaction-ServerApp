class PlayerRotation {
  private noOfAvailablePlayers: number;
  private availablePlayers: number[];
  private currentTurn: number;

  constructor(input: number) {
    this.noOfAvailablePlayers = input;
    this.availablePlayers = [];
    this.currentTurn = 0;
    for (let idx = 0; idx < input; idx++) {
      this.availablePlayers.push(idx);
    }
  }

  removePlayer(playerNumber: number) {
    this.noOfAvailablePlayers--;

    const currentPlayer = this.availablePlayers[this.currentTurn];
    this.availablePlayers = this.availablePlayers.filter(
      elem => elem !== playerNumber
    );
    this.currentTurn = this.availablePlayers.indexOf(currentPlayer);
  }

  getCurrentPlayer() {
    return this.availablePlayers[this.currentTurn];
  }

  updateNextPlayer() {
    this.currentTurn = (this.currentTurn + 1) % this.noOfAvailablePlayers;
    return this.availablePlayers[this.currentTurn];
  }
}

export default PlayerRotation;

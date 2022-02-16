class Client {
  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.jwt = null;
    this.isPlayer = false;
  }

  setClientType(isPlayer) {
    this.isPlayer = isPlayer === true;
  }
}

module.exports = Client;

type TwoDimArray<T> = Array<Array<T>>;

interface FeedbackCallbacks {
  cellUpdateCallback: (
    row: number,
    col: number,
    value: number,
    color: number
  ) => any;
  playerOut: (playerNumber: number) => any;
  playerWins: (playerNumber: number) => any;
}

class Tile {
  maxValue: number;
  value: number;
  color: number;

  constructor() {
    this.maxValue = 4;
    this.value = 0;
    this.color = -1;
  }
}

class ChainReaction {
  private rowNo: number;
  private colNo: number;

  private board: TwoDimArray<Tile>;
  private playerCells;

  constructor(rowNum: number, colNum: number, noOfPlayers: number) {
    this.rowNo = rowNum;
    this.colNo = colNum;

    this.board = [];
    this.playerCells = [];

    for (let i = 0; i < noOfPlayers; i++) this.playerCells.push(0);

    this.initializeBoard();
  }

  public getBoard() {
    return this.board;
  }

  private initializeBoard() {
    for (let row = 0; row < this.rowNo; row++) {
      const rowArray = [];
      for (let col = 0; col < this.colNo; col++) {
        const tile = new Tile();

        // Setting proper values for edges & corners
        if (row === 0 || row === this.rowNo - 1) tile.maxValue--;
        if (col === 0 || col === this.colNo - 1) tile.maxValue--;

        rowArray.push(tile);
      }
      this.board.push(rowArray);
    }
  }

  populateBoard(
    boardValues: number[],
    calleeUpdateCallback: (
      row: number,
      col: number,
      value: number,
      color: number
    ) => any
  ) {
    let cell: Tile;
    for (let row = 0, idx = 0; row < this.rowNo; row++) {
      for (let col = 0; col < this.colNo; col++, idx++) {
        // This is capable for a max of 9 players only (single digit)
        if (boardValues[idx] !== 0) {
          cell = this.board[row][col];
          cell.value = boardValues[idx] % 10;
          cell.color = Math.floor(boardValues[idx] / 10);

          calleeUpdateCallback(row, col, cell.value, cell.color);
        }
      }
    }
  }

  addNucleus(
    row: number,
    col: number,
    color: number,
    uiUpdateCallbackObject: FeedbackCallbacks
  ) {
    // Add check for valid row col when exposing api
    const cellColor = this.board[row][col].color;
    if (cellColor !== -1 && cellColor !== color) return false;

    this.board[row][col].value++;
    this.board[row][col].color = color;
    this.playerCells[color] += cellColor === -1 ? 1 : 0;

    if (this.board[row][col].maxValue === this.board[row][col].value) {
      this.doChainReaction(row, col, color, uiUpdateCallbackObject);
    } else {
      uiUpdateCallbackObject.cellUpdateCallback(
        row,
        col,
        this.board[row][col].value,
        color
      );
    }

    return true;
  }

  private isGameOver({
    playerOut,
    playerWins,
  }: {
    playerOut: (idx: number) => any;
    playerWins: (idx: number) => any;
  }) {
    const gameOverFor: number[] = [];
    let livePlayers = [];

    for (let idx = 0; idx < 4; idx++) {
      if (this.playerCells[idx] === 0) {
        gameOverFor.push(idx);
        this.playerCells[idx] = -1;
      } else if (this.playerCells[idx] > 0) {
        livePlayers.push(idx);
      }
    }

    if (livePlayers.length === 1) {
      playerWins(livePlayers[0]);
      return 1;
    }

    if (gameOverFor.length !== 0) gameOverFor.forEach(playerOut);
    return 0;
  }

  private doChainReaction(
    inputRow: number,
    inputCol: number,
    inputColor: number,
    uiUpdateCallbackObject: FeedbackCallbacks
  ) {
    let queue: TwoDimArray<number> = [[inputRow, inputCol]];

    const updateQueuedElementsUI = (inputQueue: TwoDimArray<number>) => {
      for (let idx = 0; idx < inputQueue.length; idx++) {
        const [row, col] = inputQueue[idx];
        uiUpdateCallbackObject.cellUpdateCallback(
          row,
          col,
          this.board[row][col].value,
          this.board[row][col].color
        );
      }
    };

    // TODO :: Make this recursive with requestAnimation frame
    while (queue.length !== 0) {
      const newQueue = [];
      for (let idx = 0; idx < queue.length; idx++) {
        const [row, col] = queue[idx];

        if (this.board[row][col].maxValue !== this.board[row][col].value)
          continue;

        // Updating bursting cell
        if (this.board[row][col].maxValue === this.board[row][col].value) {
          this.board[row][col].value = 0;
          this.board[row][col].color = -1;
          this.playerCells[inputColor]--;
        } else {
          this.board[row][col].value %= this.board[row][col].maxValue;
        }

        // Adding cells affected by burst
        if (row > 0) newQueue.push([row - 1, col]);
        if (row < this.rowNo - 1) newQueue.push([row + 1, col]);

        if (col > 0) newQueue.push([row, col - 1]);
        if (col < this.colNo - 1) newQueue.push([row, col + 1]);
      }

      // Updating adjacent cell affected by burst
      for (let idx = 0; idx < newQueue.length; idx++) {
        const [row, col] = newQueue[idx];

        const currentCellColor = this.board[row][col].color,
          occupyingNewCell = currentCellColor !== inputColor ? 1 : 0;

        this.playerCells[inputColor] += occupyingNewCell;
        if (currentCellColor !== -1)
          this.playerCells[currentCellColor] -= occupyingNewCell;

        this.board[row][col].value++;
        this.board[row][col].color = inputColor;
      }

      // Updating UI
      updateQueuedElementsUI(queue);

      if (this.isGameOver(uiUpdateCallbackObject)) {
        queue = [];
        updateQueuedElementsUI(newQueue);
      } else {
        queue = newQueue;
      }
    }
  }

  callOnCells(
    color: number,
    possibleCellCallback: (row: number, col: number) => any,
    blockedCellCallback: (row: number, col: number) => any
  ) {
    for (let row = 0; row < this.rowNo; row++) {
      for (let col = 0; col < this.colNo; col++) {
        if (
          this.board[row][col].color === -1 ||
          this.board[row][col].color === color
        ) {
          possibleCellCallback(row, col);
        } else {
          blockedCellCallback(row, col);
        }
      }
    }
  }
}

export default ChainReaction;

export { FeedbackCallbacks };

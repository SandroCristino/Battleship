function gameboard() {
    const board = new Array(10)
      .fill(null)
      .map(() => new Array(10).fill(null));

    const hitBoard = new Array(10)
      .fill(null)
      .map(() => new Array(10).fill(false));

    const ships = [];
  
    function placeShip(ship, x, y, isHorizontal) {
      const shipLength = ship.length;
      const shipCoordinates = [];
  
      if (isHorizontal) {
        for (let i = 0; i < shipLength; i++) {
          shipCoordinates.push({ x: x + i, y: y });
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          shipCoordinates.push({ x: x, y: y + i });
        }
      }
  
      const isPlacementValid = shipCoordinates.every(({ x, y }) => {
        return x >= 0 && x < board.length && y >= 0 && y < board[0].length && board[x][y] == null;
      });
  
      if (isPlacementValid) {
        ships.push(ship);
        shipCoordinates.forEach(({ x, y }) => {
          board[x][y] = ship;
        });
        return true;
      } else return false;
    }
  
    function receiveAttack(x, y) {
      // If cell has already been hit >> return
      if (hitBoard[x][y]) {
        return 'alreadyHit';
      }
  
      // Mark the cell as hit
      hitBoard[x][y] = true;

      // Check if there is a ship at the cell
      const ship = board[x][y];

      if (ship) {
        ship.hit();
        // If ship has been hit
        return true;
      }

      // If ship hasn't been hit
      return false;
    }

    function checkGameover() {
      for (let i = 0; i < ships.length; i++) {
        if (!ships[i].isSunk()) {
          return false;
        }
      }
      return true;
    }
  
    return {
      board,
      hitBoard,
      ships,
      placeShip,
      receiveAttack,
      checkGameover,
    };
}
  

module.exports = { gameboard }
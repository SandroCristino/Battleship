const Gameboard = require('./gameboard').gameboard;
const Ship = require('./ship').createShips;

export default class UI {
    // Loading content

    static loadHomepage() {
        const userGameboard = Gameboard();
        const enemyGameboard = Gameboard();

        UI.loadGameboard();
        UI.setShips(userGameboard, enemyGameboard);
    }
    
    static loadGameboard() {
        const board = document.getElementById('userGameboard');
        const boardEnemy = document.getElementById('enemyGameboard')
        const textbox = document.getElementById('textBox');
        const numRows = 10; 
        const numCols = 0; 

        // Generate user gameboard
        for (let row = 0; row < numRows; row++) {
            const rowElem = document.createElement("div");
            rowElem.classList.add("cell");
            board.appendChild(rowElem);
            
            for (let col = 9; col >= numCols; col--) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                rowElem.appendChild(cell);
            }
        }

        // Enemy gameboard
        for (let row = 0; row < numRows; row++) {
            const rowElem = document.createElement("div");
            rowElem.classList.add("cell");
            boardEnemy.appendChild(rowElem);
            
            for (let col = 9; col >= numCols; col--) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                rowElem.appendChild(cell);
            }
        }
        textbox.innerHTML = 'Welcome to Battleship'
    }

    static setShips(userGameboard, enemyGameboard) {
        const textbox = document.getElementById('textBox');
        const button = document.getElementById('button');
        const board = document.getElementById('userGameboard');

        textbox.innerHTML = 'Set your first ships';
        button.classList.remove('visible');
        button.innerHTML = 'Horizontal'

        button.addEventListener('click', function() {
            if (button.innerHTML == 'Horizontal') button.innerHTML = 'Vertical'
            else button.innerHTML = 'Horizontal'
        })
        const ships = [
            { name: 'Carrier', length: 5 },
            { name: 'Battleship', length: 4 },
            { name: 'Cruiser', length: 3 },
            { name: 'Submarine', length: 3 },
            { name: 'Destroyer', length: 2 }
        ];

            let shipCounter = 0;
            let shipLength = ships[shipCounter].length;
            const cells = board.querySelectorAll('.cell');

            cells.forEach(cell => {
                const row = Number(cell.dataset.row);
                const col = Number(cell.dataset.col);


                // Place shadow ship
                function mouseOverEvent() {
                    if (button.innerHTML == 'Horizontal') {
                        for (let i = 0; i < shipLength; i++) {
                            const nextCell = document.querySelector(`[data-row="${row+i}"][data-col="${col}"]`);
                            nextCell.classList.add('shipMarked')
                        }  
                    } else {
                        for (let i = 1; i < shipLength; i++) {
                            const nextCell = document.querySelector(`[data-row="${row}"][data-col="${col+i}"]`);
                            nextCell.classList.add('shipMarked')
                        }
                    }
                }
                cell.addEventListener('mouseover', mouseOverEvent)

                // Remove shadow ship
                function mouseOutEvent() {
                    if (button.innerHTML == 'Horizontal') {
                        for (let i = 0; i < shipLength; i++) {
                            const nextCell = document.querySelector(`[data-row="${row+i}"][data-col="${col}"]`);
                            nextCell.classList.remove('shipMarked')
                        } 
                    } else {
                        for (let i = 0; i < shipLength; i++) {
                            const nextCell = document.querySelector(`[data-row="${row}"][data-col="${col+i}"]`);
                            nextCell.classList.remove('shipMarked')
                        } 
                    }
                }
                cell.addEventListener('mouseout', mouseOutEvent)

                // Place the ship
                cell.addEventListener('click', function placeShipEvent() {

                    let isInside = true;
                    let isHorizontal = button.innerHTML == 'Horizontal' ? true : false;
                    // Horizontal
                    if (isHorizontal) {
                        for (let i = 0; i < shipLength; i++) {
                            const nextCell = document.querySelector(`[data-row="${row+i}"][data-col="${col}"]`);
                            if (nextCell.classList.contains('shipPlaced') || row + i > 11) {
                                isInside = false;
                                break;
                            }
                        }   
                        if (isInside) {
                            // Place the ship in userGameboard
                            const ship = Ship(shipLength);
                            userGameboard.placeShip(ship, row, col, isHorizontal)

                            // Add to UI
                            for (let i = 0; i < shipLength; i++) {
                                const nextCell = document.querySelector(`[data-row="${row+i}"][data-col="${col}"]`);
                                nextCell.classList.add('shipPlaced')
                            } 

                            // Update gamemode
                            shipCounter ++;
                            // Remove eventListener
                            if (shipCounter > 4) {
                                cells.forEach(cell => {
                                    const clonedCell = cell.cloneNode(true);
                                    cell.parentNode.replaceChild(clonedCell, cell);
                                });

                                return UI.startGameEngine(userGameboard, enemyGameboard);
                            }
                            textbox.innerHTML = (`Place the ${ships[shipCounter].name}`)
                            shipLength = ships[shipCounter].length;
                        }
                    }
                    
                    // Vertical
                    if (!isHorizontal) {
                        for (let i = 0; i < shipLength; i++) {
                            const nextCell = document.querySelector(`[data-row="${row}"][data-col="${col+i}"]`);
                            if (nextCell.classList.contains('shipPlaced') || col + i > 11) isInside = false;
                        }   
                        if (isInside) {
                            // Place the ship in userGameboard
                            const ship = Ship(shipLength);
                            userGameboard.placeShip(ship, row, col, isHorizontal)

                            // Add to UI
                            for (let i = 0; i < shipLength; i++) {
                                const nextCell = document.querySelector(`[data-row="${row}"][data-col="${col+i}"]`);
                                nextCell.classList.add('shipPlaced')
                            } 

                            // Update gamemode
                            shipCounter ++;
                            textbox.innerHTML = (`Place the ${ships[shipCounter].name}`)
                            shipLength = ships[shipCounter].length;
                        }
                    }

                })
            })
            
        
    }

    static startGameEngine(userGameboard, enemyGameboard) {
        const textbox = document.getElementById('textBox');
        textbox.innerHTML = 'Your turn'

        // Set enemyGameboard
        const enemyShips = [
            { length: 5, name: 'Carrier' },
            { length: 4, name: 'Battleship' },
            { length: 3, name: 'Cruiser' },
            { length: 3, name: 'Submarine' },
            { length: 2, name: 'Destroyer' },
        ];
        
        for (let i = 0; i < enemyShips.length; i++) {
            const shipLength = enemyShips[i].length;
            const ship = Ship(shipLength);
            let isValid = false;
        
            while (!isValid) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const isHorizontal = Math.random() < 0.5;
        
                isValid = enemyGameboard.placeShip(ship, col, row, isHorizontal);
            }
        }
        console.log(enemyGameboard.board)

        // Make enemy gameboard visible
        const boardEnemy = document.getElementById('enemyGameboard');
        const boardUser = document.getElementById('userGameboard')
        boardEnemy.classList.remove('visually-hidden')

        // Start do and recieve attack sequence 
        const cells = boardEnemy.querySelectorAll('.cell');
        const playerCells = boardUser.querySelectorAll('.cell')
            
        cells.forEach(cell => {

            cell.addEventListener('click', function() {
                const row = Number(cell.dataset.row);
                const col = Number(cell.dataset.col);
                if (row == undefined || row == NaN) return
                const result = enemyGameboard.receiveAttack(row, col);
              
                if (result) {
                  cell.classList.add('shipHit');
                  // Find ship in ships
                  const ship = enemyGameboard.board[row][col];
                  if (ship.isSunk()) {
                    textbox.innerHTML = `You sank the ship`
                    if (enemyGameboard.checkGameover()) {
                        textbox.innerHTML = 'You Win. Reload the page to restart the game'
                    }
                  } else {
                    textbox.innerHTML = 'You hit'
                  }

                  // Player's turn again
                  return;
                } else {
                  cell.classList.add('miss');
                  textbox.innerHTML = 'You missed'
                }
              
                // Check if all enemy ships are sunk
               

                // Enemy's turn
                enemyTurn(userGameboard);
                function enemyTurn(playerGameboard, hitRow, hitCol) {
                    // Select a random cell to attack
                    let row, col, result

                    // Check if enemy already hit a cell
                    if (hitRow != undefined) {
                        let preventEndlessLoop = 0;
                        do {
                            let x = Math.random() < 0.5;
                            if (preventEndlessLoop > 6) {
                                enemyTurn(userGameboard)
                            }
                            if (Math.random() < 0.5) {
                                if (x) row = hitRow + 1
                                else row = hitRow - 1
                                col = hitCol
                                preventEndlessLoop++;
                                if (row < 0) continue;
                            } else {
                                if (x) col = hitCol + 1
                                else col = hitCol - 1
                                row = hitRow
                                preventEndlessLoop++;
                                if (col < 0) continue;
                            }
                            result = playerGameboard.receiveAttack(row, col);
                        } while (result == 'alreadyHit')
                    } else {
                        do {
                            row = Math.floor(Math.random() * 10);
                            col = Math.floor(Math.random() * 10);
                            result = playerGameboard.receiveAttack(row, col);
                        } while (result == 'alreadyHit')
                    }

                    // Attack the cell
                    if (result) {
                        // Mark the cell as hit
                        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        cell.classList.remove('shipPlaced')
                        cell.classList.add('shipHit');

                        // Find ship in ships
                        const ship = playerGameboard.board[row][col];
                        if (ship.isSunk()) {
                            textbox.innerHTML = `Your ship has been sank`
                        } else {
                            textbox.innerHTML = 'Enemy hit'

                        }
                        
                        // Enemy's turn again
                        setTimeout(function() {
                            enemyTurn(userGameboard, row, col)
                          }, 1000);
                       
                    } else {
                        // Mark the cell as missed
                        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        cell.classList.remove('shipPlaced')
                        cell.classList.add('miss');
                        textbox.innerHTML = 'Enemy missed'
                    }
                    
                    
                    // Check if all player ships are sunk
                    if (playerGameboard.checkGameover()) {
                        textbox.innerHTML = 'Enemy Wins. Reload the page to restart the game'
                    }
                }
                  

            })
        })
        
    }

}




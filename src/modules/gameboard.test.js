const Gameboard = require('./gameboard').gameboard;
const Ship = require('./ship').createShips;
const Player = require('./player').player;

describe('Gameboard', () => {
    let gameboard;
    let ship;
    let player;
  
    beforeEach(() => {
      gameboard = Gameboard();
      ship = Ship(3);
      player = Player();
      gameboard.placeShip(ship, 0, 0, true);
    });
  
    test('receiveAttack marks hit on the correct ship', () => {
      gameboard.receiveAttack(0, 0);
      expect(ship.hits).toEqual([true, false, false]);
    });

    test('ship is sunk', () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(0, 2);
      expect(ship.hits).toEqual([true,true,true])
    })
  
    test('receiveAttack marks miss on the board', () => {
      gameboard.receiveAttack(0,1);
      expect(gameboard.hitBoard[1][0]).toBe(true);
    });

    test('should return true if all ships sunk', () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(0, 2);
      expect(gameboard.checkGameover()).toBe(true);
    });

    test('attack is successfull', () => {
      expect(player.attack(gameboard, 0, 0)).toBe(true)
    })

    test('attack is unsuccessfull', () => {
      expect(player.attack(gameboard, 1, 0)).toBe(false)
    })

  });
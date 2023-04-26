const ship = require('./ship').createShips;

test('get back length of ship', () => {    
    const newShip = ship(2);
    expect(newShip.length).toBe(2)
});

test('Ship should be sunk', () => {
    const newShip = ship(2);
    newShip.hit(0);
    newShip.hit(1);
    expect(newShip.isSunk).toBeTruthy();
})

test('Ship should be alive', () => {
    const newShip = ship(2);
    newShip.hit(0);
    console.log(newShip.isSunk())
    expect(newShip.isSunk()).not.toBeTruthy();
})


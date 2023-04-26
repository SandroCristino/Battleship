function player() {

    function attack(enemyGameboard, x, y) {
       return (enemyGameboard.receiveAttack(x, y))
    }

    function getRandomPosition() {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return { x, y } 
    }

    function playerTurn(enemyGameboard) {
        let position = getRandomPosition();
        while (enemyGameboard.hitBoard[position.y][position.x]) {
            position = getRandomPosition();
        }
        enemyGameboard.receiveAttack(position.x, position.y);
        const success = enemyGameboard.receiveAttack(position.x, position.y);

        return {x: position.x, y: position.y, success: success};
    }

    return {
        attack,
        playerTurn,
    }
}

module.exports = { player }
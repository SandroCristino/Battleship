function createShips(length) {
    let hitCounter = 0;
    const hits = new Array(length).fill(false);

    
    function hit() {
        hits[hitCounter] = true;
        hitCounter++
    }
    
    function isSunk() {
        return hits.every((hit) => hit);
    }
    
    return {
        length,
        hit,
        hits,
        isSunk,
    }
}

module.exports = { createShips }
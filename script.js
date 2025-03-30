const X_CLASS = 'X';
const O_CLASS = 'O';
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
let currentPlayer = X_CLASS;
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.textContent !== '') return;

    placeMark(cell, X_CLASS);
    if (checkWin(X_CLASS)) {
        endGame(false);
        return;
    }
    if (isDraw()) {
        endGame(true);
        return;
    }

    currentPlayer = O_CLASS;
    status.textContent = "Computer is thinking...";
    
    setTimeout(computerMove, 500);
}

function computerMove() {
    if (!gameActive) return;

    let bestMove = findBestMove();
    const cell = cells[bestMove];
    placeMark(cell, O_CLASS);

    if (checkWin(O_CLASS)) {
        endGame(false);
        return;
    }
    if (isDraw()) {
        endGame(true);
        return;
    }

    currentPlayer = X_CLASS;
    status.textContent = "Your turn! (X)";
}

function findBestMove() {
    let availableMoves = [];
    cells.forEach((cell, index) => {
        if (cell.textContent === '') {
            availableMoves.push(index);
        }
    });

    // Check for winning move
    for (let move of availableMoves) {
        cells[move].textContent = O_CLASS;
        if (checkWin(O_CLASS)) {
            cells[move].textContent = '';
            return move;
        }
        cells[move].textContent = '';
    }

    // Check for blocking player's winning move
    for (let move of availableMoves) {
        cells[move].textContent = X_CLASS;
        if (checkWin(X_CLASS)) {
            cells[move].textContent = '';
            return move;
        }
        cells[move].textContent = '';
    }

    // Take center if available
    if (availableMoves.includes(4)) return 4;

    // Take a random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass;
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentClass;
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent !== '';
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        status.textContent = "Game ended in a draw!";
    } else {
        status.textContent = `${currentPlayer === O_CLASS ? "Computer" : "You"} won!`;
    }
}

function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = X_CLASS;
    gameActive = true;
    status.textContent = "Your turn! (X)";
}
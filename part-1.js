const readlineSync = require('readline-sync');

const boardCols = 3;
const boardRows = 3;
const totalShips = 2;

const initializeBoard = () => {
  let board = [];
  for (let i = 0; i < boardRows; i++) {
    let row = [];
    for (let j = 0; j < boardCols; j++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
};

const placeShips = (board) => {
  let ships = 0;
  while (ships < totalShips) {
    let col = Math.floor(Math.random() * boardCols);
    let row = Math.floor(Math.random() * boardRows);

    if (!board[row][col]) {
      board[row][col] = true;
      ships++;
    }
  }
};


const startGame = () => {
  console.log('Press any key to start the game.');
  readlineSync.keyInPause();

  let board = initializeBoard();
  placeShips(board);
  let remainingShips = totalShips;

  while (remainingShips > 0) {
    let userGuess = readlineSync.question('Enter a location to strike (e.g. A2): ').toUpperCase();
    let col = userGuess.charCodeAt(0) - 65;
    let row = parseInt(userGuess.charAt(1)) - 1;

    if (board[row][col]) {
      console.log('Hit!');
      remainingShips--;
    } else if (board[row][col] === false) {
      console.log('Miss!');
    } else {
      console.log('You already picked this location! Miss!');
    }
    board[row][col] = null;

    if (remainingShips === 0) {
      let playAgain = readlineSync.keyInYNStrict('You won! Do you want to play again? (Y/N)');
      if (playAgain) {
        board = initializeBoard();
        placeShips(board);
        remainingShips = totalShips;
      } else {
        break;
      }
    }
  }
};

startGame();
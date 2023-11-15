const readlineSync = require('readline-sync');

//Initialize Variables
const boardCols = 3;
const boardRows = 3;
const totalShips = 2;
let boardShips = [];
let remainingShips = 0;

//Initialize board using arrays for columns, pushing values of false to indicate each column + row combination
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
    let tempLocs = [];
    let col = Math.floor(Math.random() * boardCols);
    let row = Math.floor(Math.random() * boardRows);
    let isVertical = Math.floor(Math.random() > 0.5);

    //Builds the ship "upwards" if positive, "right" if negative
    if (isVertical) {
        tempLocs = [[col, row], [col, row + 1],  [col, row + 2], [col, row + 3]]
    }
    else {
        tempLocs = [[col, row], [col + 1, row],  [col + 2, row], [col + 3, row]]
    }

    //Checks to see if all generated locations are valid
    let validPlacement = true;

    for (let i = 0; i < tempLocs.length; i++) {
      if (
        tempLocs[i][0] >= boardCols ||
        tempLocs[i][1] >= boardRows ||
        board[tempLocs[i][1]][tempLocs[i][0]]
      ) {
        validPlacement = false;
        break;
      }
    }

    //Pushes ship to array if all locations are valid
    if (validPlacement) {
      for (let i = 0; i < tempLocs.length; i++) {
        board[tempLocs[i][1]][tempLocs[i][0]] = true;
      }
      boardShips.push({ alive: true, locations: tempLocs });
      ships++;
    }
  }
};

//Main game logic
const startGame = () => {
  console.log('Press any key to start the game.');
  readlineSync.keyInPause();

  let board = initializeBoard();
  placeShips(board);
  let remainingShips = totalShips;

  const isValidInput = function(input) {
    if (input.length === 2 && input.charCodeAt(0) - 65 < boardRows && input.charCodeAt(1) >= boardCols) {
        isValid = true;
    }
  }

  }

  while (remainingShips > 0 && (!isValid)) {
    let userGuess;
    let isValid = false;

    userGuess = readlineSync.question('Enter a location to strike (e.g. A2): ').toUpperCase();
    isValid = isValidInput(userGuess);

    if (!isValid) {
        console.log('Invalid input!')
    }
    
    let col = userGuess.charCodeAt(0) - 65;
    let row = parseInt(userGuess.charAt(1)) - 1;
    console.log(`You entered ${userGuess}.`, userGuess);

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
};

startGame();
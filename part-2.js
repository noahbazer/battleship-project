const readlineSync = require('readline-sync');

//Initialize Variables
const boardCols = 9;
const boardRows = 9;
const totalShips = 5;
let boardShips = [];
let remainingShips = 0;
const shipLengths = [2, 3, 3, 4, 5]

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
    //Initializes variables on every run
    let tempLocs = [];
    let col = Math.floor(Math.random() * boardCols);
    let row = Math.floor(Math.random() * boardRows);
    let isVertical = Math.floor(Math.random() < 0.5);

      //Sets location
      for (let p = 0; p < shipLengths[ships]; p++) {
        if (isVertical) {
          tempLocs.push([col, row + p])
        }
        else {
          tempLocs.push([col + p, row])
        }
      }
        let validPlacement = true;

        for (let u = 0; u < tempLocs.length; u++) {
          if (
            tempLocs[u][0] >= boardCols ||
            tempLocs[u][1] >= boardRows ||
            board[tempLocs[u][1]][tempLocs[u][0]]
          ) {
            validPlacement = false;
            tempLocs = [];
          }
        }
        if (validPlacement) {
          for (let i = 0; i < tempLocs.length; i++) {
            board[tempLocs[i][1]][tempLocs[i][0]] = true;
          }
            boardShips.push({ id: ships + 1, locations: tempLocs});
            ships++;
          tempLocs = [];
          isVertical = Math.floor(Math.random() > 0.5); 
          console.table(boardShips);
        }

  }
};

//Main game logic
const startGame = () => {
  console.log('Press any key to start the game.');
  readlineSync.keyInPause();

  let board = initializeBoard();
  placeShips(board);
  remainingShips = totalShips;

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
      let hitShip = boardShips.find(ship => ship.locations.some(location => location[0] === row && location[1] === col));
      hitShip.locations = hitShip.locations.filter(location => location[0] !== row || location[1] !== col);
      if (hitShip.locations.length === 0) {
        console.log('Ship sunk!');
      }
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
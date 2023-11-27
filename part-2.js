const readlineSync = require('readline-sync');
const chalk = require('chalk');


// Hey Andrei! It appears that in my haste to add a bunch of QoL features, I botched my ship placement code by moving my
// vertical Boolean generator INSIDE of my ships' length generator, so it would re-run the generator on every iteration,
// causing breaks in the ships' locations. Sorry about that!

//Initialize meta variables
let boardSize = 10;
const totalShips = 5;
let placeAttempts = 0;
let ships = 0;
let boardShips = [];
let remainingShips = 5;
const shipLengths = [2, 3, 3, 4, 5]

//Initialize board using arrays for columns, pushing values of false to indicate each column + row combination
const initializeBoard = (boardSize) => {
  let board = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
};

const pushShipToArray = function(board, tempLocs) {
    for (let i = 0; i < tempLocs.length; i++) {
      board[tempLocs[i][1]][tempLocs[i][0]] = true;
    }
      boardShips.push({ id: ships + 1, locations: tempLocs});
      ships++;
      placeAttempts++;
    tempLocs = [];
}

//Checks to see if all ship location spots are valid
const validateLocations = function(board, tempLocs) {
  let validPlacement = true;
  for (let u = 0; u < tempLocs.length; u++) {
    if (tempLocs[u][0] >= boardSize 
      || tempLocs[u][1] >= boardSize 
      || board[tempLocs[u][1]][tempLocs[u][0]]
    ) {
      validPlacement = false;
      tempLocs = [];
    }
  }
  if (validPlacement) {
    pushShipToArray(board, tempLocs);
  }
}


//Set (or reset) ship count and place ships
const placeShips = (board, boardSize) => {
  ships = 0;
  while (ships < totalShips) {
    //Initializes variables on every run
    let tempLocs = [];
    let col = Math.floor(Math.random() * boardSize);
    let row = Math.floor(Math.random() * boardSize);
    let isVertical = (Math.random() < .5);
      //Sets location of ships relative to first value
      for (let p = 0; p < shipLengths[ships]; p++) {
        if (isVertical) {
          tempLocs.push([col, row + p])
        }
        else {
          tempLocs.push([col + p, row])
        }
      }
    validateLocations(board, tempLocs, ships);
  }
};

const isValidInput = function(input, boardSize) {
  let isValid = false;
  if (input.length === 2 
    && input.charCodeAt(0) - 65 < (boardSize)
    && input.charCodeAt(0) - 65 > -1
    && input[1] <= boardSize
    && input[1] > 0
    ||
    input.length === 3
    && input.charCodeAt(0) - 65 < (boardSize)
    && input[1] === '1'
    && input[2] === '0'
    ) {
      isValid = true;
  }
  return isValid;
} 

const handleHit = function(row, col, userGuess) {
  console.log((`You attack ${userGuess}.`) + chalk.greenBright(' Hit!'));
  let hitShip = boardShips
    .find(ship => ship.locations
    .some(location => location[0] === col && location[1] === row)
  );

  //Removes hit location from ship's array, and checks to see if ship is sunk
  hitShip.locations = hitShip.locations.filter((location => location[0] !== col || location[1] !== row));
  if (hitShip.locations.length === 0) {
    remainingShips--;
    if (remainingShips === 1) {
      console.log(chalk.yellowBright(`Ship sunk! ${remainingShips} ship remaining!`));
    }
    else {
      console.log(chalk.yellowBright(`Ship sunk! ${remainingShips} ships remaining!`));
    }
  }
}

const inputHandle = function(userGuess, isValid) {
  if (userGuess.toUpperCase() === 'SHIPS') {
      console.log(chalk.cyanBright(`There are ${remainingShips} ships remaining.`))
    }
    else if (!isValid) {
        console.log(chalk.redBright('Invalid input! Try something like \'E4!\''))
    }

    //If valid, sets guess to 2/3 character numeric string to match array values\
    else {
    let col = userGuess.charCodeAt(0) - 65;
    let row = 0;
    if (userGuess.length === 3 && boardSize >= 10) {
      row = 9;
    }
    else {
      row = parseInt(userGuess.charAt(1) - 1);
    };

    if (board[row][col]) {
      handleHit(row, col, userGuess);
    } else if (board[row][col] === false) {
      console.log((`You attack ${userGuess}.`) + (chalk.red(' Miss!')));
    } else {
      console.log(chalk.red(`You\'ve already attacked ${userGuess}! Miss!`));
    }

    //Used as catch all "else" condition to check repeated inputs
    board[row][col] = null;
  }
}

const logAttempts = function() {
  let consoleAttempts = '';
  if (placeAttempts < 40) {
    consoleAttempts = chalk.greenBright(`${placeAttempts} Placement attempts,`);
  } else if (placeAttempts < 60) {
    consoleAttempts = chalk.yellowBright(`${placeAttempts} Placement attempts,`);
  } else {
    consoleAttempts = chalk.redBright(`${placeAttempts} Placement attempts,`);
  }
  console.log(consoleAttempts + chalk.greenBright(` ${totalShips} passed!`));
  placeAttempts = 0;
}

//Main game logic
const startGame = (boardSize) => {
  let board = initializeBoard(boardSize);
  placeShips(board, boardSize);
  remainingShips = totalShips;
  let consoleAttempts = '';
  return board;
  }

  let board = startGame(boardSize);
  console.table(board);
  console.log(boardShips.map((item) => item.locations));
  logAttempts();
  console.log('Press any key to start the game.');
  readlineSync.keyInPause();
  while (remainingShips > 0) {
    let userGuess = readlineSync.question('Enter a location to strike (or \'SHIPS\' to see remaining ships): ').toUpperCase();
    isValid = isValidInput(userGuess, boardSize);
    
    //Allows users to see how many ships are remaining
    inputHandle(userGuess, isValid);

    if (remainingShips === 0) {
      let playAgain = readlineSync.keyInYNStrict(chalk.cyanBright('You won! Do you want to play again?'));
      if (playAgain) {
        board = initializeBoard();
        placeShips(board);
        remainingShips = totalShips;
      } else {
        break;
      }
    }
};
startGame(boardSize);
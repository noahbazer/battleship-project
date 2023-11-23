const readlineSync = require('readline-sync');
const chalk = require('chalk');


// Hey Andrei! It appears that in my haste to add a bunch of QoL features, I botched my ship placement code by moving my
// vertical Boolean generator INSIDE of my ships' length generator, so it would re-run the generator on every iteration,
// causing breaks in the ships' locations. Sorry about that!

//Initialize meta variables
const boardCols = 9;
const boardRows = 9;
const totalShips = 5;
let placeAttempts = 0;
let ships = 0;
let boardShips = [];
let remainingShips = 5;
const shipLengths = [2, 3, 3, 4, 5]

//Initialize board using arrays for columns, pushing values of false to indicate each column + row combination
const initializeBoard = (rows, columns) => {
  let board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
};

const checkLocs = function(board, tempLocs) {
  let validPlacement = true;
  //Checks to see if all ship location spots are valid
  for (let u = 0; u < tempLocs.length; u++) {
    if (tempLocs[u][0] >= boardCols 
      || tempLocs[u][1] >= boardRows 
      || board[tempLocs[u][1]][tempLocs[u][0]]
    ) {
      validPlacement = false;
      tempLocs = [];
    }
  }
  //Sets the hit detector for each slot to true and pushes the ship to the active ships array
  if (validPlacement) {
    for (let i = 0; i < tempLocs.length; i++) {
      board[tempLocs[i][1]][tempLocs[i][0]] = true;
    }
      boardShips.push({ id: ships + 1, locations: tempLocs});
      ships++;
    tempLocs = [];
  }
}


//Set (or reset) ship count and place ships
const placeShips = (board, rows, columns) => {
  while (ships < totalShips) {
    placeAttempts = placeAttempts + 1;
    //Initializes variables on every run
    let tempLocs = [];
    let col = Math.floor(Math.random() * columns);
    let row = Math.floor(Math.random() * rows);
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
      checkLocs(board, tempLocs);
  }
};

const isValidInput = function(input) {
  let isValid = false;
  if (input.length === 2 
    && input.charCodeAt(0) - 65 < (boardCols)
    && input.charCodeAt(0) - 65 > -1
    && input[1] <= boardRows
    && input[1] > 0) {
      isValid = true;
  }
  return isValid;
} 

const findHit = function(row, col, userGuess) {
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

    //If valid, sets guess to 2 character numeric string to match array values\
    else {
    let col = userGuess.charCodeAt(0) - 65;
    let row = parseInt(userGuess.charAt(1) - 1);
    if (board[row][col]) {
      findHit(row, col, userGuess);
    } else if (board[row][col] === false) {
      console.log((`You attack ${userGuess}.`) + (chalk.red(' Miss!')));
    } else {
      console.log(chalk.red(`You\'ve already attacked ${userGuess}! Miss!`));
    }

    //Used as catch all "else" condition to check repeated inputs
    board[row][col] = null;
  }
}

//Main game logic
const startGame = () => {
  let board = initializeBoard(boardRows, boardCols);
  placeShips(board, boardRows, boardCols);
  remainingShips = totalShips;
  //console.table(board);
  //console.log(boardShips.map((ship) => ship.locations));
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
  return board;
  }


  let board = startGame();
  console.log('Press any key to start the game.');
  readlineSync.keyInPause();
  while (remainingShips > 0) {

    let userGuess = readlineSync.question('Enter a location to strike (or \'SHIPS\' to see remaining ships): ').toUpperCase();
    isValid = isValidInput(userGuess);
    
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
startGame();
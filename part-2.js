const readlineSync = require('readline-sync');
const chalk = require('chalk');


//Initialize Variables
const boardCols = 9;
const boardRows = 9;
const totalShips = 5;
let boardShips = [];
let remainingShips = 5;
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

      //Sets location of ships relative to first value
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
          if (tempLocs[u][0] >= boardCols 
            || tempLocs[u][1] >= boardRows 
            || board[tempLocs[u][1]][tempLocs[u][0]]
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
        }
  }
};

//Main game logic
const startGame = () => {
  let board = initializeBoard();
  placeShips(board);
  console.log('Board Complete, Ships Placed')
  remainingShips = totalShips;
  console.log('Parameters Set')
  return board;
  }

  const isValidInput = function(input) {
    let isValid = false;
    if (input.length === 2 
      && input.charCodeAt(0) - 65 < boardCols
      && input.charCodeAt(0) - 65 > 0
      && input[1] < boardRows
      && input[1] > 0) {
        isValid = true;
    }
    return isValid;
  } 

  console.log('Before input query');
  let board = startGame();
  while (remainingShips > 0) {

    let userGuess = readlineSync.question('Enter a location to strike (e.g. A2): ').toUpperCase();
    isValid = isValidInput(userGuess);
    
    if (userGuess.toUpperCase() === 'SHIPS') {
      console.log(chalk.cyanBright(`There are ${remainingShips} ships remaining.`))
    }
    else if (!isValid) {
        console.log(chalk.redBright('Invalid input!'))
    }
    else {
    let col = userGuess.charCodeAt(0) - 65;
    let row = parseInt(userGuess.charAt(1)) - 1;
    if (board[row][col]) {
      console.log((`You attack ${userGuess}.`) + chalk.greenBright(' Hit!'));
      let hitShip = boardShips
        .find(ship => ship.locations
        .some(location => location[0] === col && location[1] === row)
      );
    
      hitShip.locations = hitShip.locations.filter((location => location[0] !== col || location[1] !== row));
      if (hitShip.locations.length === 0) {
        remainingShips--;
        console.log(chalk.yellowBright(`Ship sunk! ${remainingShips} ships remaining!`));
      }
    } else if (board[row][col] === false) {
      console.log((`You attack ${userGuess}.`) + (chalk.red(' Miss!')));
    } else {
      console.log(chalk.red(`You\'ve already attacked ${userGuess}! Miss!`));
    }
    board[row][col] = null;
  }

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
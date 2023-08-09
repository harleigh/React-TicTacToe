//every begining has a begining, and this is this begining. And, being that
//this is the begining, take it with a grain of salt as there is quite a road
//yet being paved; as I am learning, all code and documentation are "as is"

/**
 * This code is directly based off of the tutoral at https://react.dev/learn
 * 
 * Curly braces, {}, let us escape back to the land of javascript
 * useState allows us to remember variables and update the screen
 *    returns a tuple (val, setVal)  val being the state  (like a counter)
 *    and setVal the method to update the state--and I think forces a refresh...
 * 
 */

/**
 * Square is used in TicTacToeBoard is used in MainGame
 */

import { useState } from 'react';



/*
  A square of the tictactoe board
  value: 'X' or 'O'
  onSquareClick: the function the square calls when the square is clicked
*/
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}//end function Square



/**
 *  This function is the main brains of tictactoe, building the game board, checking
 *  for a winner, handeling the markings of the squares
 *  xIsNext    flag whether x is the next player
 *  gameMoves  an array of 9 elements representing the tictactoe moves
 *  updateGame function that updates game based off of the most recent move
 * 
 * @returns a container with
 *            1. the game status (whose move, who won)
 *            2. a 3x3 tictactoe board
 */
function TicTacToeBoard( { xIsNext, gameMoves, updateGame, moveNumber } ) {

  const symbolX = "X";
  const symbolO = "O";

  const winner = calculateWinner(gameMoves);
  let gameStatus
  if(winner){
    gameStatus = "Winner: " + winner;
  }
  else { //no winner
    if(moveNumber===9){
       gameStatus = "Cats Eye"
    }
    else {
      gameStatus = "Next player: " + (xIsNext ? symbolX : symbolO);
    }
  }


  /**
   *  function handles the click of the ith square; this function is called by
   *  the square piece
   *    i: integer 0...8 representing which tictactoe square has been clicked
   */
  function handleClick(i) {
    // check if this square is already chosen or a winner has been achieved
    if (gameMoves[i] || calculateWinner(gameMoves)) { return; }

    //set the ith square to the correct symbol
    const newSquares = gameMoves.slice();
    newSquares[i] = (xIsNext ? symbolX : symbolO);

    //update the state of the squares and whether player X is next
    updateGame(newSquares)
  }//end function handleClick


  /*
    This function builds the board the user sees in the browser
    returns: component (which is the 3x3 tictactoe grid)
  */
  function buildBoardInterface(){
    //the game board that the user sees, built from the movearray
    const gameUI = [];

    //we build each row of the board 012, then 345, then 678
    for(let i=0; i< gameMoves.length/3; i++) {
      gameUI.push( <div className="board-row">
                          <Square value={gameMoves[3*i]}   onSquareClick={() => handleClick(3*i)} />
                          <Square value={gameMoves[3*i+1]} onSquareClick={() => handleClick(3*i+1)} />
                          <Square value={gameMoves[3*i+2]} onSquareClick={() => handleClick(3*i+2)} />
                        </div>
                      );//end push
    }//end for
    return gameUI; 
  }//end function build board


  /*
  determine if there is a winner to the tictactoe game
  returns: null if no winner, else the letter of the winner ('X' or 'O')
*/
  function calculateWinner() {
    //all possible winning combinations of as lines
    const winningLines = [
      [0, 1, 2],    //top row win
      [3, 4, 5],    //middle row win
      [6, 7, 8],    //bottom row win
      [0, 3, 6],    //left column win
      [1, 4, 7],    //middle column win
      [2, 5, 8],    //right column win
      [0, 4, 8],    //diagonal left to right
      [2, 4, 6]     //diagonal right to left
    ];

    //checking for winner along each of the winning lines
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (gameMoves[a] && gameMoves[a] === gameMoves[b] && gameMoves[a] === gameMoves[c]) {
        return gameMoves[a];
      }
    }
    return null;
  }//end checking for the winner


  //the game board with status (e.g. who's move is next etc)
  //component can't return multiple tags so we wrap the board in an empty container
   return ( <>
              <div className='status'>{gameStatus}</div>
              {buildBoardInterface()}
          </>); 
}//end tictactoe board



/**
 * This is the highest component of the tictactoe game that manages
 * the history of moves, and allows the user to jump between any move
 * of the game
 * 
 * @returns a component containing 
 *    1. a silly welcome message
 *    2. the tictactoe board
 *    3. an ordered list of buttons that allow the user to jump to any
 *       move made in the game.
 */
export default function MainGame() {
  /**
   * history is an array of 9-element arrays
   * history[i] is the ith move of the game, so history[0]
   * is simply a blank tictactoe board
   */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  

  /**
   * Setting wether x is next in the game, and setting the 
   * current game board (of tictactoe) to the youngest element
   * in the history array (i.e. most recent history)
   */
  const xIsNext = currentMove % 2 === 0;
  const currentBoard = history[currentMove];


  /**
   * Take the newest play in the game and store it into the history, and
   * switch the game to the next player.  Because the player can jump to
   * any state of the game, we must manage the history based on the 
   * current move.
   * @param newGameSquares: The newest move that a player made on the board
   *                     which is going to be stuffed into the history. 
   */
  function manageGameState(newGameSquares) {
    const pastHistory =  history.slice(0, currentMove+1);
    const currentHistory = [...pastHistory, newGameSquares]
    setHistory(currentHistory);
    setCurrentMove(currentHistory.length - 1);
  }//end manage game state


  /**
   * The user can jump to any move in the game, this function sets the
   * current move of the game to the move number the user desirs to jump
   * to. 
   * @param {*} moveNum: the move in the game the user is jumping to
   *                     0,...,8 
   */
  function jumpToMove(moveNum){
    setCurrentMove(moveNum);    //current move num is where we jump to
  }

  /**
   * Build a button for each move made in the game, storing them in a list
   * keyed on the move number (which is a unique key).  Each button, when
   * clicked executes the function that will jump to the desired move
   *  moveNum:   the nth move of the game (0->8)
   *  gameState: the squares in the tictactoe board at the current move number
   * 
   * when the user clicks on a button, then jumpToMove(moveNum) is called
   */
  const moveArray = history.map(  (_, moveNum)  => {
      const desc = moveNum>0? 'Go to move #' + moveNum: 'Go to Start of Game'
      return ( 
        <li key={moveNum}>
            <button onClick={()=> jumpToMove(moveNum)}>
              {desc}
            </button>
        </li>
      );
  })//end map


  /**
   * Componet of the tictactoe board, along with an ordered list of buttons
   * where the user can jump between any move made in the game
   */
  return (
    <>
      <div className='title'>
        <h1>Hello Tic Tac Toe</h1>
      </div>
       <div className='game'>
        <div className='game-board'>
          <TicTacToeBoard xIsNext={xIsNext}
                          gameMoves={currentBoard}
                          updateGame={manageGameState}
                          moveNumber= {currentMove}/>
        </div>
        <div className="game-info">
          <ol>{moveArray}</ol>
        </div>
      </div>
    </> 
  );
}//end main game
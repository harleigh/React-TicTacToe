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



function MyTicTacToe( { xIsNext, squares, playHandler } ) {

  const symbolX = "X";
  const symbolO = "O";

  const winner = calculateWinner(squares);
  const gameStatus = winner? "Winner: " + winner : "Next player: " + (xIsNext ? symbolX : symbolO);

  /**
   *  function handles the click of the ith square; this function is called by
   *  the square piece
   *    i: integer 0...8 representing which tictactoe square has been clicked
   */
  function handleClick(i) {
    // check if this square is already chosen or a winner has been achieved
    if (squares[i] || calculateWinner(squares)) { return; }

    //set the ith square to the correct symbol
    const newSquares = squares.slice();
    newSquares[i] = (xIsNext ? symbolX : symbolO);

    //update the state of the squares and whether player X is next
    playHandler(newSquares)
  }//end function handleClick


  /*
    This function builds the board the user sees in the browser
    returns: component (which is the 3x3 tictactoe grid)
  */
  function buildBoard(){
    //this will store the gameboard
    const gameBoard = [];

    //we build each row of the board 012, then 345, then 678
    for(let i=0; i< squares.length/3; i++) {
        gameBoard.push( <div className="board-row">
                          <Square value={squares[3*i]}   onSquareClick={() => handleClick(3*i)} />
                          <Square value={squares[3*i+1]} onSquareClick={() => handleClick(3*i+1)} />
                          <Square value={squares[3*i+2]} onSquareClick={() => handleClick(3*i+2)} />
                        </div>
                      );//end push
    }//end for
    return gameBoard; 
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }//end checking for the winner

  //the game board with status (e.g. who's move is next etc)
  //component can't return multiple tags so we wrap the board in an empty container
   return ( <>
              <div className='status'>{gameStatus}</div>
              {buildBoard()}
          </>); 
}//end main tic tac to game


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
  function manageTurn(newGameSquares) {
    const pastHistory =  history.slice(0, currentMove+1);
    const currentHistory = [...pastHistory, newGameSquares]
    setHistory(currentHistory);
    setCurrentMove(currentHistory.length - 1);
  }


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

  return (
    <>
      <div><h1>Hello Game</h1></div>
       <div className='game'>
        <div className='game-board'>
          <MyTicTacToe xIsNext={xIsNext} squares={currentBoard} playHandler={manageTurn}/>
        </div>
        <div className="game-info">
          <ol>{moveArray}</ol>
        </div>
      </div>
    </> 
  );
}
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
  
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div><h1>Hello Game</h1></div>
       <div className='game'>
        <div className='game-board'>
          <MyTicTacToe xIsNext={xIsNext} squares={currentSquares} playHandler={handlePlay}/>
        </div>
      </div>
    </> 
  );
}
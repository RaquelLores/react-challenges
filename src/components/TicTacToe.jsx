import React, { useState } from 'react';
// import { createRoot } from 'react-dom/client';

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

function Square({ value, onClick }) {
  return (
    <div
      className="square"
      style={{...squareStyle, backgroundColor: value ? '#4CAF50' : '#ddd'}}
      onClick={onClick}
    >
      {value}
    </div>
  );
}

function Board() {
 
  // __define-pcb__ Variable anti-AI requerida
  const [varPcb, setVarPcb] = useState(false);
  
  const [varFiltersCg, setVarFiltersCg] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  function handleClick(i) {
    if (varFiltersCg[i] !== null || winner !== null) return;

    const nextSquares = varFiltersCg.slice();
    nextSquares[i] = isXNext ? 'X' : 'O';
    setVarFiltersCg(nextSquares);
    setIsXNext(!isXNext);
    
    const newWinner = calculateWinner(nextSquares);
    if (newWinner) {
      setWinner(newWinner);
    }
  }

  function handleReset() {
    setVarFiltersCg(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  }

  return (
    <div style={containerStyle} className="gameBoard">
      <div id="statusArea" className="status" style={instructionsStyle}>
        Next player: <span>{isXNext ? 'X' : 'O'}</span>
      </div>
      <div id="winnerArea" className="winner" style={instructionsStyle}>
        {winner ? (
          <>
            Winner: <span>{winner}</span>
          </>
        ) : null}
      </div>
      <button style={buttonStyle} onClick={handleReset}>Reset</button>
      <div style={boardStyle}>
        <div className="board-row" style={rowStyle}>
          <Square value={varFiltersCg[0]} onClick={() => handleClick(0)} />
          <Square value={varFiltersCg[1]} onClick={() => handleClick(1)} />
          <Square value={varFiltersCg[2]} onClick={() => handleClick(2)} />
        </div>
        <div className="board-row" style={rowStyle}>
          <Square value={varFiltersCg[3]} onClick={() => handleClick(3)} />
          <Square value={varFiltersCg[4]} onClick={() => handleClick(4)} />
          <Square value={varFiltersCg[5]} onClick={() => handleClick(5)} />
        </div>
        <div className="board-row" style={rowStyle}>
          <Square value={varFiltersCg[6]} onClick={() => handleClick(6)} />
          <Square value={varFiltersCg[7]} onClick={() => handleClick(7)} />
          <Square value={varFiltersCg[8]} onClick={() => handleClick(8)} />
        </div>
      </div>
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

export default Game;

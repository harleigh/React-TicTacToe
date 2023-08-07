import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TicTacToe from './TicTacToe';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TicTacToe />
  </React.StrictMode>
);


/**
 * an example: This would give us two boards
        root.render(
          <React.StrictMode>
            <TicTacToe />
            <TicTacToe />
          </React.StrictMode>
      );
    So, perhaps we can build all our seperate components in different files
 */
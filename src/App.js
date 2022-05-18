import React, { useState, useEffect, createContext } from 'react';
import Board from './Components/Board';
import Keyboard from './Components/Keyboard';
import GameOver from './Components/GameOver';
import { boardDefault, generateWordSet } from './Words'
import "./App.css";

export const AppContext = createContext()

function App() {

  const [board, setBoard] = useState(boardDefault);
  const [currentAttempt, setCurrentAttempt] = useState({ attempt: 0, letterPosition: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false})

  const correctWord = 'RIGHT';

  useEffect(() => {
    generateWordSet()
      .then(words => {
        setWordSet(words.wordSet) //wordSet is an obj from words.js when we are returning it
      })
  }, []);

  const onSelectLetter = (keyVal) => {
    if (currentAttempt.letterPosition > 4) return;
    const newBoard = [...board];
    newBoard[currentAttempt.attempt][currentAttempt.letterPosition] = keyVal;
    setBoard(newBoard);
    setCurrentAttempt({ ...currentAttempt, letterPosition: currentAttempt.letterPosition + 1 })
  }
  const onDelete = () => {
    if (currentAttempt.letterPosition === 0) return;
    const newBoard = [...board];
    newBoard[currentAttempt.attempt][currentAttempt.letterPosition - 1] = '';
    setBoard(newBoard)
    setCurrentAttempt({ ...currentAttempt, letterPosition: currentAttempt.letterPosition - 1 })
  }
  const onEnter = () => {
    if (currentAttempt.letterPosition !== 5) return;

    let currentWord = '';
    for (let i = 0; i < 5; i++) {
      currentWord += board[currentAttempt.attempt][i];
    }

    //PROVERI OVAJ DEO KODA!!!

    if (wordSet.has(currentWord.toLowerCase())) {
      setCurrentAttempt({ attempt: currentAttempt.attempt + 1, letterPosition: 0 })
    } else {
      setCurrentAttempt({ attempt: currentAttempt.attempt + 1, letterPosition: 0 })
    }

    if (currentWord === correctWord) {
      setGameOver({gameOver: true, guessedWord: true})
      return;
    }

    if(currentAttempt.attempt === 5) {
      setGameOver({gameOver:true, guessedWord: false})
    }


  }

  return (
    <div className='App'>
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider value={{
        board,
        setBoard,
        currentAttempt,
        setCurrentAttempt,
        onSelectLetter,
        onDelete,
        onEnter,
        correctWord,
        disabledLetters,
        setDisabledLetters,
        gameOver,
        setGameOver,
      }}>
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>

    </div>
  )
}

export default App
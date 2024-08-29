import { useState, useEffect, useRef } from 'react';
import { generate_random_number } from '../utils/randomNum';

function ScoreBoard({ computerScoreBoard, humanScoreBoard }) {
  return (
    <>
      <h1 className="text-slate-200 font-bold text-2xl">Score Board</h1>
      <div className="flex justify-around shadow-lg border border-indigo-300 py-6 px-2 rounded-xl items-center w-full max-w-lg mb-8">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold text-red-500">👽</h3>
          <p className="text-3xl font-semibold">{computerScoreBoard}</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold text-blue-500">👨</h3>
          <p className="text-3xl font-semibold">{humanScoreBoard}</p>
        </div>
      </div>
    </>
  );
}

export default function GameBoardComp() {
  const [isOpen, setIsOpen] = useState(false);
  const [humanGuess, setHumanGuess] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [randomNum, setRandomNum] = useState(null);
  const [alienScoreCount, setAlienScoreCount] = useState(10);
  const [humanScoreCount, setHumanScoreCount] = useState(10);
  const [humanScoreBoard, setHumanScoreBoard] = useState(0);
  const [alienScoreBoard, setAlienScoreBoard] = useState(0);
  const [turn, setTurn] = useState('human');
  const [gameMessage, setGameMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState();
  const [hint, setHint] = useState('');

  const guessSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  useEffect(() => {
    setAlienScoreBoard(parseInt(localStorage.getItem('alien')) || 0);
    setHumanScoreBoard(parseInt(localStorage.getItem('human')) || 0);
  }, []);

  const handleHumanGenNum = () => {
    if (turn === 'human') {
      setIsGenerating(true);
      const humanRandNum = generate_random_number();

      console.log('Human generated a number:', humanRandNum);

      if (humanRandNum) {
        setIsGenerating(false);
        setRandomNum(humanRandNum);
        setGameMessage('Alien is guessing...');
        handleAlienGuess(humanRandNum);
      } else {
        setIsGenerating(false);
      }
    } else {
      setGameMessage('Not Your Turn');
    }
  };

  const handleAlienGuess = (humanRandNum) => {
    setTimeout(() => {
      const isCorrect = Math.random() < 0.8;

      let alienRandNum;
      if (isCorrect) {
        alienRandNum = humanRandNum;
      } else {
        do {
          alienRandNum = generate_random_number();
        } while (alienRandNum === humanRandNum);
      }

      console.log('Alien guessed a number:', alienRandNum);

      if (alienRandNum === humanRandNum) {
        setGameMessage('Alien guessed correctly! Your Turn to Guess');
        setTurn('alien');
      } else {
        setAlienScoreCount((prev) => prev - 1);
        setGameMessage('Alien missed! Generate again.');
        setTurn('human');
      }
    }, 7000);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleHumanGuess = (guess) => {
    setHumanGuess(guess);
    setIsOpen(false);
    setGameMessage(`You picked ${guess}. Let's see what alien is hiding.`);
    console.log('Selected guess is', guess);

    if (guess === randomNum) {
      setHumanScoreCount((prev) => prev);
      setGameMessage('You guessed correctly!');
      setTurn('human');
    } else {
      setHumanScoreCount((prev) => prev - 1);
      setGameMessage('Oops! you missed.');
      setTurn('alien');
    }
  };

  const playAgain = () => {
    setAlienScoreCount(10);
    setHumanScoreCount(10);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (randomNum) {
      const timer = setTimeout(() => {
        setRandomNum(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [randomNum, setRandomNum]);

  useEffect(() => {
    if (turn === 'alien') {
      const random = generate_random_number();
      console.log(random, 'alien');
      setRandomNum(random);
    }
  }, [turn]);

  useEffect(() => {
    if (humanScoreCount === 0 || alienScoreCount === 0) {
      setIsGameOver(true);
      console.log('This round is finished');

      // winSoundRef.current.play();
    }
    if (isGameOver && humanScoreCount === 0) {
      setGameMessage('You Lost!');
      setWinner('alien');
      setHumanScoreBoard((prev) => prev);
      setAlienScoreBoard((prev) => prev + 1);
    }

    if (isGameOver && alienScoreCount === 0) {
      setGameMessage('You Won!');
      setWinner('human');
      setHumanScoreBoard((prev) => prev + 1);
      setAlienScoreBoard((prev) => prev);
    }
  }, [humanScoreCount, alienScoreCount, isGameOver]);

  const persistScoreBoard = () => {
    if (isGameOver) {
      localStorage.setItem('alien', alienScoreBoard);
      localStorage.setItem('human', humanScoreBoard);
    }
    return;
  };

  persistScoreBoard();

  const getHint = () => {
    const hint = `The alien number is between ${randomNum <= 10 ? 1 : 11} and ${
      randomNum <= 10 ? 10 : 20
    }.`;
    setHint(hint);
  };

  return (
    <div className="bg-gray-900 fixed text-white w-full min-h-full flex flex-col gap-6 py-6 px-4 items-center justify-center">
      <audio
        ref={guessSoundRef}
        src="./sounds/guess.mp3"></audio>
      <audio
        ref={winSoundRef}
        src="./sounds/win.mp3"></audio>

      <ScoreBoard
        computerScoreBoard={alienScoreBoard}
        humanScoreBoard={humanScoreBoard}
      />

      <div className="text-center mb-8 w-full px-2 sm:w-4/5">
        <h1 className="text-4xl font-bold mb-6">Guess My Number</h1>
        <div className="flex justify-between items-center text-xl w-full font-bold mb-6 gap-8">
          <div className="w-24 h-24 flex flex-col justify-between  items-center">
            <img
              src="./alien.png"
              alt="alien"
              className="w-full h-full object-contain"
            />
            <p className="text-lg mt-2">Alien</p>
            <p className="text-xl font-semibold">{alienScoreCount}</p>
          </div>
          <div className="w-10 h-10 text-xl bg-yellow-500 text-gray-900 flex items-center justify-center rounded-full">
            ?
          </div>
          <div className="w-24 h-24 flex flex-col items-center">
            <img
              src="./human.png"
              alt="human"
              className="w-full h-full object-contain"
            />
            <p className="text-lg mt-2">Human</p>
            <p className="text-xl font-semibold">{humanScoreCount}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-2 px-6 rounded-md mb-4 transition-all duration-200">
          Make a Guess
        </button>
      </div>

      {randomNum && (
        <p className="text-yellow-300 text-center text-xl capitalize italic">
          Generating a number...
        </p>
      )}
      {gameMessage && (
        <p className="text-green-300 text-center text-2xl mt-4 italic">
          {gameMessage}
        </p>
      )}
      {hint && (
        <p className="text-blue-300 text-center text-xl mt-2 italic">
          Hint: {hint}
        </p>
      )}

      <div className="flex gap-3 flex-wrap ">
        <button
          onClick={() => handleHumanGenNum()}
          className="bg-gradient-to-r  mx-auto from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 mt-2">
          {isGenerating ? 'Generating' : 'Generate a Number'}
        </button>

        <button
          onClick={getHint}
          className="mt-2 bg-yellow-600 hover:bg-yellow-700 mx-auto text-white py-2 px-6 rounded-md transition-all duration-200">
          Get Hint
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
          onClick={onClose}>
          <div
            className="bg-gray-800 rounded-lg p-8 text-white sm:w-1/2 max-w-full mx-4"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Choose a Number
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 20 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleHumanGuess(i + 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-xl py-2 px-4 rounded-lg transition-all duration-200">
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
          <div className="bg-gray-800 rounded-lg p-8 text-center w-80 max-w-full mx-4">
            <h2 className="text-4xl font-bold mb-4 text-white">
              {winner} Won!
            </h2>
            <button
              onClick={playAgain}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 px-6 rounded-md transition-all duration-200">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

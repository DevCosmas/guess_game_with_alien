import { useState, useEffect } from 'react';
import { generate_random_number } from '../utils/randomNum';

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

  useEffect(() => {
    localStorage.getItem('alien');
    localStorage.getItem('alien');
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

      if (random === humanGuess) {
        setHumanScoreCount((prev) => prev);
        setGameMessage('You guessed correctly!');
        setTurn('human');
      } else {
        setHumanScoreCount((prev) => prev - 1);
        setGameMessage('Oops! you missed.');
        setTurn('alien');
      }

      // const timer = setTimeout(() => {
      //   setRandomNum(null);
      // }, 1000);

      // return () => clearTimeout(timer);
    }
  }, [turn, humanGuess]);

  useEffect(() => {
    if (humanScoreCount === 0 || alienScoreCount === 0) {
      setIsGameOver(true);
      console.log('This round is finished');
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

  return (
    <div className="bg-gray-800 fixed text-slate-50 w-full h-full flex flex-col gap-4 py-6 px-4">
      <ScoreBoard
        computerScoreBoard={alienScoreBoard}
        humanScoreBoard={humanScoreBoard}
      />

      <div className="text-center my-11">
        <h1 className="text-3xl font-bold mb-4">Guess My Number</h1>
        <div className="flex sm:justify-evenly justify-between items-center text-xl font-bold">
          <div className="w-24 h-24 flex flex-col gap-2 items-center">
            <img
              src="./alien.png"
              alt="alien"
              className="w-full h-full object-contain"
            />
            <p>Score: {alienScoreCount}</p>
          </div>
          <span className="text-5xl bg-yellow-500 text-gray-800 px-4 py-2 rounded-full">
            ?
          </span>
          <div className="w-24 h-24 flex flex-col gap-2 items-center">
            <img
              src="./human.png"
              alt="human"
              className="w-full h-full object-contain"
            />
            <p>Score: {humanScoreCount}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-6 bg-green-600 hover:bg-green-700 text-slate-50 py-2 px-4 rounded-md">
          Make a Guess
        </button>
      </div>
      {randomNum && (
        <p className="text-gray-200 text-center capitalize italic">
          Generated a random Number
        </p>
      )}
      {gameMessage && (
        <p className="text-gray-200 text-center text-2xl mt-4 italic">
          {gameMessage}
        </p>
      )}
      <button
        onClick={() => handleHumanGenNum()}
        className="bg-gradient-to-r w-4/5 sm:w-1/2 mx-auto from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500">
        {isGenerating ? 'Generating' : ' Generate a Number'}
      </button>

      <PickANumberModal
        isOpen={isOpen}
        onClose={onClose}
        onPick={handleHumanGuess}
      />

      {isGameOver && (
        <GameOverModal
          winner={winner}
          playAgain={playAgain}
        />
      )}
    </div>
  );
}

function ScoreBoard({ computerScoreBoard, humanScoreBoard }) {
  return (
    <>
      <h1 className="text-center text-3xl font-bold py-4">Score Board</h1>
      <section className="flex items-center border-b-2 border-slate-300 justify-evenly p-6 bg-gray-900 text-slate-50 rounded-lg shadow-lg">
        <article className="flex flex-col items-center gap-4">
          <h2
            className="uppercase bg-red-600 px-2 py-2 rounded-md"
            aria-label="Computer Score">
            Alien
          </h2>
          <p className="text-4xl font-sans">{computerScoreBoard}</p>
        </article>
        <article className="flex flex-col items-center gap-4">
          <h2
            className="uppercase bg-green-600 px-2 py-2 rounded-md"
            aria-label="Your Score">
            Human
          </h2>
          <p className="text-4xl font-sans">{humanScoreBoard}</p>
        </article>
      </section>
    </>
  );
}

function PickANumberModal({ isOpen, onClose, onPick }) {
  const [selectedNumber, setSelectedNumber] = useState('');

  if (!isOpen) return null;

  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
  };

  const handleConfirm = () => {
    if (selectedNumber) {
      onPick(selectedNumber);
      setSelectedNumber('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white w-96 p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-bold mb-6">Pick a Number</h2>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {numbers.map((number) => (
            <div
              key={number}
              className={`flex items-center justify-center h-12 text-2xl font-bold cursor-pointer rounded-lg transition-transform transform ${
                selectedNumber === number
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
              onClick={() => handleNumberClick(number)}>
              {number}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-bold"
            onClick={handleConfirm}>
            Confirm
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-bold"
            onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function GameOverModal({ winner, playAgain }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-4/5 sm:w-1/3 p-6 rounded-lg shadow-lg border border-white">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-6xl mb-2">{winner === 'human' ? '👊' : '❌'}</h1>
          <h1
            className={`text-3xl font-bold ${
              winner === 'human' ? 'text-green-500' : 'text-red-500'
            }`}>
            {winner === 'human' ? 'You Won!' : 'You Lost!'}
          </h1>
        </div>
        <button
          onClick={playAgain}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
          Play Again
        </button>
      </div>
    </div>
  );
}

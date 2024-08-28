import { useState } from 'react';
import { generate_random_number } from '../utils/randomNum';

export default function GameBoardComp() {
  const [isOpen, setIsOpen] = useState(false);
  const [humanGuess, setHumanGuess] = useState(null);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleHumanGuess = (guess) => {
    setHumanGuess(guess);
    setIsOpen(false);

    console.log('Selected guess is', humanGuess);
  };

  return (
    <div className="bg-gray-800 fixed text-slate-50 w-full h-full flex flex-col gap-4 py-6 px-4">
      <ScoreBoard />

      <div className="text-center my-11">
        <h1 className="text-3xl font-bold mb-4">Guess My Number</h1>
        <div className="flex sm:justify-evenly justify-between items-center text-xl font-bold">
          <div className="w-24 h-24 flex flex-col gap-2 items-center">
            <img
              src="./alien.png"
              alt="alien"
              className="w-full h-full object-contain"
            />
            <p>Score: 5</p>
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
            <p>Score: 5</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-6 bg-green-600 hover:bg-green-700 text-slate-50 py-2 px-4 rounded-md">
          Make a Guess
        </button>
      </div>

      <button
        onClick={() => generate_random_number()}
        className="bg-gradient-to-r w-4/5 sm:w-1/2 mx-auto from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500">
        Generate a Number
      </button>

      <PickANumberModal
        isOpen={isOpen}
        onClose={onClose}
        onPick={handleHumanGuess}
      />
    </div>
  );
}

function ScoreBoard({ computerScore = 0, humanScore = 0 }) {
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
          <p className="text-4xl font-sans">{computerScore}</p>
        </article>
        <article className="flex flex-col items-center gap-4">
          <h2
            className="uppercase bg-green-600 px-2 py-2 rounded-md"
            aria-label="Your Score">
            Human
          </h2>
          <p className="text-4xl font-sans">{humanScore}</p>
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

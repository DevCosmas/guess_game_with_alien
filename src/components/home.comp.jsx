import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomeComp() {
  useEffect(() => {
    document.title = 'Guess the Number Game | Home';
  });
  return (
    <div className="bg-gray-800 text-slate-50 fixed h-full w-full flex flex-col justify-center items-center">
      <div className="px-6">
        <h1 className="text-4xl font-bold my-2 text-white">
          Welcome to the Guess Game!
        </h1>
        <p className="text-xl text-white">Guess a number between 1 and 20</p>
        <p className="text-xl text-white">
          Play against an alien and save our planent from collapsing
        </p>

        <Link
          to={'/game'}
          className="mt-8 bg-blue-500 flex text-center w-4/5 sm:w-60 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
          Start Game
        </Link>
      </div>
    </div>
  );
}

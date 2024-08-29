import { useEffect } from 'react';
const { default: GameBoardComp } = require('../components/game');

export default function GameBoardPage() {
  useEffect(() => {
    document.title = 'Guess the Number Game | Play';
  });
  return <GameBoardComp></GameBoardComp>;
}

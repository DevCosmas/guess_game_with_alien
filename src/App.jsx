import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home';
import GameBoardPage from './pages/game_board';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="game"
          element={<GameBoardPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

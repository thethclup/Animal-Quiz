import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './lib/GameContext';
import LobbyScreen from './screens/LobbyScreen';
import QuizArenaScreen from './screens/QuizArenaScreen';
import GameOverScreen from './screens/GameOverScreen';

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<LobbyScreen />} />
          <Route path="/play" element={<QuizArenaScreen />} />
          <Route path="/over" element={<GameOverScreen />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

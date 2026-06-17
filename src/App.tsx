import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './lib/GameContext';
import LobbyScreen from './screens/LobbyScreen';
import QuizArenaScreen from './screens/QuizArenaScreen';
import GameOverScreen from './screens/GameOverScreen';
import { useAccount } from 'wagmi';
import { Sun } from 'lucide-react';
import { useSayGM } from './hooks/useSayGM';

function GlobalGMButton() {
  const { isConnected } = useAccount();
  const { handleSayGM, isPending } = useSayGM();

  const sendGMTransaction = () => {
    handleSayGM('say_gm_onchain_global');
  };

  if (!isConnected) return null;

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={sendGMTransaction}
        disabled={isPending}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
      >
        <Sun className="w-4 h-4" />
        {isPending ? 'Confirming...' : 'Say GM'}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative">
        <GlobalGMButton />
        <Routes>
          <Route path="/" element={<LobbyScreen />} />
          <Route path="/play" element={<QuizArenaScreen />} />
          <Route path="/over" element={<GameOverScreen />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

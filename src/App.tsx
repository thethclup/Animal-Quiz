import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './lib/GameContext';
import LobbyScreen from './screens/LobbyScreen';
import QuizArenaScreen from './screens/QuizArenaScreen';
import GameOverScreen from './screens/GameOverScreen';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Sun } from 'lucide-react';
import { logAttributedAction } from './lib/erc8021';

function GlobalGMButton() {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    if (!isConnected) return alert('Please connect wallet first.');
    logAttributedAction('say_gm_onchain_global');
    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      value: parseEther('0'),
      data: '0x' 
    }, {
      onSuccess: () => alert('GM Said on-chain!'),
      onError: (e) => console.error('Transaction rejected', e)
    });
  };

  if (!isConnected) return null;

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={sendGMTransaction}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      >
        <Sun className="w-4 h-4" />
        Say GM
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useGame } from '../lib/GameContext';
import { getRandomQuestions } from '../data/questions';
import { logAttributedAction } from '../lib/erc8021';
import { useSayGM } from '../hooks/useSayGM';

export default function LobbyScreen() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { handleSayGM, isPending } = useSayGM();
  
  const { resetGame, setQuestions, setGameMode } = useGame();

  const handlePlay = (mode: string) => {
    resetGame();
    setGameMode(mode);
    setQuestions(getRandomQuestions(5)); // Load 5 random questions for Classic logic
    logAttributedAction('start_game');
    navigate('/play');
  };

  const handleSayGMClick = () => {
    handleSayGM('say_gm_onchain');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f27d26] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#ffaa00] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-float" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 w-full max-w-md"
      >
        <h1 className="text-display text-5xl sm:text-6xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
          Animal Quiz
        </h1>
        <p className="text-gray-400 mb-12 italic text-lg">Test your knowledge of the kingdom.</p>

        <div className="space-y-4 mb-12">
          <button 
            onClick={() => handlePlay('Classic')}
            className="w-full glass-card p-6 flex flex-col items-center hover:bg-white/10 transition-colors group"
          >
            <div className="bg-[#f27d26] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(242,125,38,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Play Classic Mode</h2>
            <span className="text-micro mt-2">10 Questions • Normal Pacing</span>
          </button>
        </div>

        <div className="glass-card p-6 w-full text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-micro">On-Chain Features</h3>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-orange-400 font-mono">Base Mainnet</span>
          </div>
          
          {!isConnected ? (
            <div className="flex flex-col gap-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="pill-button w-full flex justify-center text-sm"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-sm font-mono text-gray-300">
                  {address?.slice(0,6)}...{address?.slice(-4)}
                </span>
                <button onClick={() => disconnect()} className="text-xs text-gray-500 hover:text-white">Disconnect</button>
              </div>
              <button 
                onClick={handleSayGMClick}
                disabled={isPending}
                className="pill-button accent w-full text-sm font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Confirming...' : 'Say "GM" On-Chain'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

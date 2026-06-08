import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSendTransaction } from 'wagmi';
import { motion } from 'motion/react';
import { useGame } from '../lib/GameContext';
import { submitScoreOnChain } from '../lib/siwe';
import { triggerTrustlessAgentEvent } from '../lib/erc8004';
import { logAttributedAction } from '../lib/erc8021';
import { Award, Share2, Home, Sun } from 'lucide-react';
import { parseEther } from 'viem';

export default function GameOverScreen() {
  const navigate = useNavigate();
  const { score, resetGame } = useGame();
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRecordScore = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet in the lobby first.");
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. ERC-8021 tracking
      logAttributedAction('record_score_start');
      
      // 2. Base Network / SIWE Signature
      const signature = await submitScoreOnChain(address, score);
      
      // 3. ERC-8004 Agent Trustless Sync
      triggerTrustlessAgentEvent('score_achieved', score);

      setSubmitted(true);
      alert("Score recorded on-chain successfully!");
      // Here you would normally post the signature and score payload to your API
    } catch (e) {
      console.error(e);
      alert("Failed to submit score. User rejected or error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLobby = () => {
    resetGame();
    navigate('/');
  };

  const handleSayGM = () => {
    if (!isConnected) return alert('Please connect wallet first.');
    logAttributedAction('say_gm_onchain_gameover');
    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      value: parseEther('0'),
      data: '0x' 
    }, {
      onSuccess: () => alert('GM Said on-chain!'),
      onError: (e) => console.error('Transaction rejected', e)
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md text-center z-10"
      >
        <div className="mb-8">
          <h1 className="text-display text-4xl mb-2 text-white">Quiz Completed</h1>
          <p className="text-gray-400 text-sm">Your animal knowledge is impressive.</p>
        </div>

        <div className="glass-card p-10 mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f27d26]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className="text-micro block mb-4 text-[#f27d26]">Final Score</span>
          <div className="text-6xl font-mono text-white mb-2 font-bold tracking-tighter">
            {score.toLocaleString()}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
            <Award className="w-4 h-4 mr-1 text-yellow-500" />
            Top 15% of Players
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleSayGM}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020]"
          >
            <Sun className="w-5 h-5 mr-2" />
            Say GM
          </button>

          <button 
            onClick={handleRecordScore}
            disabled={isSubmitting || submitted}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center transition-all ${
              submitted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
              : 'bg-[#f27d26] hover:bg-[#ff8e3e] text-black shadow-[0_0_20px_rgba(242,125,38,0.3)]'
            }`}
          >
            {isSubmitting ? 'Signing in Wallet...' : 
             submitted ? 'Score Secured On-Chain ✓' : 
             'Record This Quiz on-chain'}
          </button>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleBackToLobby}
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Lobby
            </button>
            <button 
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

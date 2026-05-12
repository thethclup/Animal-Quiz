import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../lib/GameContext';
import { Clock, Zap } from 'lucide-react';

export default function QuizArenaScreen() {
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, setCurrentQuestionIndex, score, setScore, streak, setStreak } = useGame();
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [shake, setShake] = useState(false);

  const question = questions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    if (isAnswering || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswering]);

  const handleTimeOut = () => {
    handleAnswer(-1); // -1 signifies timeout
  };

  const handleAnswer = (index: number) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedOption(index);

    const isCorrect = index === question.correctIndex;
    
    if (isCorrect) {
      setStreak(s => s + 1);
      setScore(s => s + 100 + (streak * 20) + (timeLeft * 5));
    } else {
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 400); // 400ms duration of shake class
    }

    setTimeout(() => {
      handleNext();
    }, 2500); // Wait 2.5s to show explanation and correct answer
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setTimeLeft(15);
      setSelectedOption(null);
      setIsAnswering(false);
    } else {
      navigate('/over');
    }
  };

  if (!question) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col pt-8 pb-12 px-6 max-w-lg mx-auto w-full relative">
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-8 text-sm">
        <div className="flex items-center space-x-2 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
          <Clock className="w-4 h-4 text-orange-400" />
          <span className={`font-mono font-medium ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-200'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <Zap className={`w-4 h-4 ${streak > 2 ? 'text-yellow-400' : 'text-gray-500'}`} />
            <span className="font-mono text-gray-300">x{streak}</span>
          </div>
          <div className="bg-white/5 py-1.5 px-4 rounded-full border border-white/10 font-mono text-white text-base">
            {score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 text-micro text-center text-gray-500">
        Question {currentQuestionIndex + 1} of {questions.length} • {question.category}
      </div>

      {/* Media & Question */}
      <motion.div 
        key={`q-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`flex-1 flex flex-col ${shake ? 'animate-shake' : ''}`}
      >
        <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 relative">
          <img src={question.imageUrl} alt={question.category} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
          <h2 className="absolute bottom-4 left-4 right-4 text-xl sm:text-2xl font-serif text-white tracking-tight leading-snug">
            {question.text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1 flex flex-col justify-end">
          {question.options.map((opt, i) => {
            let isCorrect = i === question.correctIndex;
            let isSelected = i === selectedOption;
            
            let buttonClass = "w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 font-medium transition-all";
            
            if (isAnswering) {
              if (isCorrect) {
                buttonClass += " bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
              } else if (isSelected) {
                buttonClass += " bg-red-500/20 border-red-500 text-red-300";
              } else {
                buttonClass += " opacity-40";
              }
            } else {
              buttonClass += " hover:bg-white/10 active:scale-[0.98]";
            }

            return (
              <button 
                key={i} 
                onClick={() => handleAnswer(i)}
                disabled={isAnswering}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs mr-3 font-mono opacity-60">
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Explanation Toast (shows when answering) */}
      <AnimatePresence>
        {isAnswering && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-2xl z-20"
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                {selectedOption === question.correctIndex ? (
                  <span className="text-xl">✨</span>
                ) : (
                  <span className="text-xl">💡</span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1 text-white">
                  {selectedOption === question.correctIndex ? "Correct!" : "Did you know?"}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

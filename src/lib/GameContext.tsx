import React, { createContext, useContext, useState } from 'react';
import { Question } from '../data/questions';

interface GameState {
  score: number;
  streak: number;
  questions: Question[];
  currentQuestionIndex: number;
  gameMode: string;
  setScore: (score: number | ((s: number) => number)) => void;
  setStreak: (streak: number | ((s: number) => number)) => void;
  setQuestions: (q: Question[]) => void;
  setCurrentQuestionIndex: (i: number | ((i: number) => number)) => void;
  setGameMode: (m: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameMode, setGameMode] = useState<string>('Classic');

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setQuestions([]);
    setCurrentQuestionIndex(0);
  };

  return (
    <GameContext.Provider value={{
      score, setScore,
      streak, setStreak,
      questions, setQuestions,
      currentQuestionIndex, setCurrentQuestionIndex,
      gameMode, setGameMode,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

import { useState, useEffect } from 'react';

export function useGameLoop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  const startGame = () => {
    setScore(0);
    setStreak(0);
    setIsPlaying(true);
  };
  
  const registerAnswer = (isCorrect: boolean, timeBonus: number) => {
    if (isCorrect) {
      setStreak(s => s + 1);
      setScore(s => s + 100 + (streak * 50) + timeBonus);
    } else {
      setStreak(0);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
  };

  return {
    isPlaying,
    score,
    streak,
    startGame,
    registerAnswer,
    endGame
  };
}

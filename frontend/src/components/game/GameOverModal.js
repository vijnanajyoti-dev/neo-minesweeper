import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, RotateCcw, Home } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import confetti from 'canvas-confetti';

export const GameOverModal = ({ onRestart, onHome }) => {
  const { gameStatus, timer, gridSize } = useGame();
  const isWin = gameStatus === 'won';
  const isOpen = gameStatus === 'won' || gameStatus === 'lost';

  useEffect(() => {
    if (isWin) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#F97316']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#F97316']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isWin]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="game-over-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-[#18181B] rounded-2xl border border-[#27272A] p-8 text-center"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="mb-6">
              {isWin ? (
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4">
                  <Trophy size={40} className="text-white" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 mb-4">
                  <Skull size={40} className="text-white" />
                </div>
              )}
              
              <h2 className="text-3xl font-bold text-[#FAFAFA] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {isWin ? 'Victory!' : 'Game Over'}
              </h2>
              <p className="text-[#A1A1AA]">
                {isWin ? 'Congratulations! You cleared the field!' : 'Better luck next time!'}
              </p>
            </div>

            <div className="space-y-3 mb-6 p-4 bg-[#09090B] rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Time:</span>
                <span className="text-[#FAFAFA] font-mono font-bold">{formatTime(timer)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Grid Size:</span>
                <span className="text-[#FAFAFA] font-mono font-bold">{gridSize}×{gridSize}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                data-testid="restart-btn"
                onClick={onRestart}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#22C55E' }}
              >
                <RotateCcw size={20} />
                <span className="hidden sm:inline">Play Again</span>
                <span className="sm:hidden">Again</span>
              </button>
              
              <button
                data-testid="home-btn"
                onClick={onHome}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-[#FAFAFA] bg-[#27272A] hover:bg-[#3F3F46] transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                <span className="hidden sm:inline">New Setup</span>
                <span className="sm:hidden">Setup</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
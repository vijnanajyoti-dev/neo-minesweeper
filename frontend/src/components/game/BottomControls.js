import React from 'react';
import { MousePointerClick, Flag } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';

export const BottomControls = () => {
  const { flagMode, setFlagMode, gameStatus } = useGame();
  const { currentTheme } = useTheme();

  if (gameStatus !== 'playing') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-[100] bg-[#09090B] border-t border-[#27272A] p-3">
      <div className="flex gap-2 max-w-md mx-auto">
        <button
          data-testid="dig-mode-btn"
          onClick={() => setFlagMode(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${
            !flagMode ? 'text-white' : 'text-[#A1A1AA] bg-[#27272A]'
          }`}
          style={{
            backgroundColor: !flagMode ? currentTheme.primary : undefined
          }}
        >
          <MousePointerClick size={18} />
          Dig
        </button>
        
        <button
          data-testid="flag-mode-btn"
          onClick={() => setFlagMode(true)}
          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${
            flagMode ? 'bg-yellow-500 text-black' : 'text-[#A1A1AA] bg-[#27272A]'
          }`}
        >
          <Flag size={18} />
          Flag
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { Timer, Flag, RotateCcw, Volume2, VolumeX, Settings, Trophy, BarChart3 } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';

export const Header = ({ onSettings, onLeaderboard, onStats }) => {
  const { timer, mineCount, flagCount, soundEnabled, setSoundEnabled, startNewGame, theme } = useGame();
  const { currentTheme } = useTheme();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="sticky top-0 z-50 backdrop-blur-md bg-[#09090B]/80 border-b border-[#27272A] px-4 py-3"
      style={{ boxShadow: currentTheme.glow }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2" data-testid="timer-display">
            <Timer size={18} style={{ color: currentTheme.primary }} className="hidden sm:block" />
            <span className="font-mono font-bold text-base md:text-lg" style={{ color: currentTheme.primary }}>
              {formatTime(timer)}
            </span>
          </div>
          
          <div className="flex items-center gap-2" data-testid="mine-counter">
            <Flag size={18} className="text-yellow-400 hidden sm:block" />
            <span className="font-mono font-bold text-base md:text-lg text-[#FAFAFA]">
              {flagCount}/{mineCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            data-testid="stats-btn"
            onClick={onStats}
            className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors hidden sm:block"
            title="Statistics"
          >
            <BarChart3 size={18} className="text-[#FAFAFA]" />
          </button>

          <button
            data-testid="leaderboard-btn"
            onClick={onLeaderboard}
            className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors hidden sm:block"
            title="Leaderboard"
          >
            <Trophy size={18} className="text-[#FAFAFA]" />
          </button>

          <button
            data-testid="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors"
            title="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 size={18} className="text-[#FAFAFA]" />
            ) : (
              <VolumeX size={18} className="text-[#A1A1AA]" />
            )}
          </button>

          <button
            data-testid="new-game-btn"
            onClick={() => startNewGame()}
            className="p-2 rounded-lg hover:bg-[#3F3F46] transition-colors"
            style={{ backgroundColor: currentTheme.primary }}
            title="New game"
          >
            <RotateCcw size={18} className="text-white" />
          </button>

          <button
            data-testid="settings-btn"
            onClick={onSettings}
            className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors"
            title="Settings"
          >
            <Settings size={18} className="text-[#FAFAFA]" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Zap } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useGame } from '@/contexts/GameContext';

export const SetupModal = ({ isOpen, onClose, onStart }) => {
  const { theme: currentTheme, difficulty: currentDifficulty, DIFFICULTIES } = useGame();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentDifficulty);
  const [gridSize, setGridSize] = useState(DIFFICULTIES[currentDifficulty].gridSize);
  const [customMode, setCustomMode] = useState(false);

  const handleDifficultyChange = (diff) => {
    setSelectedDifficulty(diff);
    if (!customMode) {
      setGridSize(DIFFICULTIES[diff].gridSize);
    }
  };

  const handleStart = () => {
    onStart(gridSize, selectedTheme, selectedDifficulty);
    onClose();
  };

  const handleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 8 && value <= 30) {
      setGridSize(value);
      setCustomMode(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="setup-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl bg-[#18181B] rounded-2xl border border-[#27272A] p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Game Setup
              </h2>
              <button
                data-testid="close-setup-btn"
                onClick={onClose}
                className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors"
              >
                <X size={20} className="text-[#FAFAFA]" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-3 flex items-center gap-2">
                  <Zap size={16} />
                  Select Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(DIFFICULTIES).map(([key, config]) => (
                    <button
                      key={key}
                      data-testid={`difficulty-${key}-btn`}
                      onClick={() => handleDifficultyChange(key)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDifficulty === key
                          ? 'border-[#22C55E] bg-[#22C55E]/10'
                          : 'border-[#27272A] bg-[#09090B] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#FAFAFA] mb-1">
                          {config.name}
                        </div>
                        <div className="text-xs text-[#A1A1AA]">
                          {config.gridSize}×{config.gridSize}
                        </div>
                        <div className="text-xs text-[#A1A1AA] mt-1">
                          {Math.floor(config.gridSize * config.gridSize * config.mineRatio)} mines
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-3">
                  Select Theme
                </label>
                <ThemeSelector
                  selectedTheme={selectedTheme}
                  onSelect={setSelectedTheme}
                />
              </div>

              {/* Custom Grid Size */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Grid Size: {gridSize} × {gridSize}
                  {customMode && <span className="ml-2 text-xs text-[#22C55E]">(Custom)</span>}
                </label>
                <input
                  data-testid="grid-size-input"
                  type="range"
                  min="8"
                  max="30"
                  value={gridSize}
                  onChange={handleSizeChange}
                  className="w-full h-2 bg-[#27272A] rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-[#A1A1AA] mt-1">
                  <span>8×8 (Min)</span>
                  <span>30×30 (Max)</span>
                </div>
              </div>

              <button
                data-testid="start-game-btn"
                onClick={handleStart}
                className="w-full py-3 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#22C55E' }}
              >
                <Play size={20} />
                Start Game
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

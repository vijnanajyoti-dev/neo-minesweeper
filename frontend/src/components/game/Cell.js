import React from 'react';
import { motion } from 'framer-motion';
import { Bomb, Skull, Crosshair, Swords, PawPrint, Flag } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import useSound from 'use-sound';

const numberColors = [
  '#3B82F6',
  '#22C55E',
  '#EF4444',
  '#A855F7',
  '#F97316',
  '#06B6D4',
  '#EC4899',
  '#EAB308'
];

const iconMap = {
  Bomb: Bomb,
  Skull: Skull,
  Crosshair: Crosshair,
  Swords: Swords,
  PawPrint: PawPrint
};

export const Cell = ({ row, col, cell }) => {
  const { revealCell, toggleFlag, gameStatus, flagMode, soundEnabled } = useGame();
  const { currentTheme } = useTheme();
  const IconComponent = iconMap[currentTheme.icon] || Bomb;

  const handleClick = () => {
    if (flagMode) {
      toggleFlag(row, col);
    } else {
      revealCell(row, col);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    toggleFlag(row, col);
  };

  const handleLongPress = () => {
    if (!flagMode) {
      toggleFlag(row, col);
    }
  };

  let content = null;
  let bgColor = '#27272A';
  let borderStyle = 'border-t-[#3F3F46] border-l-[#3F3F46] border-b-[#18181B] border-r-[#18181B]';

  if (cell.isFlagged) {
    content = <Flag size={16} className="text-yellow-400" />;
  } else if (cell.isRevealed) {
    bgColor = '#18181B';
    borderStyle = 'border-[#18181B]';
    
    if (cell.isMine) {
      content = <IconComponent size={18} style={{ color: currentTheme.primary }} />;
    } else if (cell.neighborMines > 0) {
      content = (
        <span
          className="font-bold text-sm"
          style={{ color: numberColors[cell.neighborMines - 1] }}
        >
          {cell.neighborMines}
        </span>
      );
    }
  }

  return (
    <motion.button
      data-testid={`cell-${row}-${col}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      disabled={gameStatus !== 'playing'}
      className={`w-full aspect-square flex items-center justify-center border-2 ${borderStyle} transition-colors`}
      style={{
        backgroundColor: bgColor,
        cursor: gameStatus === 'playing' ? 'pointer' : 'default'
      }}
      initial={false}
      animate={{
        scale: cell.isRevealed ? [1, 0.95, 1] : 1
      }}
      whileHover={!cell.isRevealed && gameStatus === 'playing' ? {
        backgroundColor: '#3F3F46'
      } : {}}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {content}
    </motion.button>
  );
};
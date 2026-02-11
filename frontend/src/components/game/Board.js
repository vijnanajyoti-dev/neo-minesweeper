import React from 'react';
import { Cell } from './Cell';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';

export const Board = () => {
  const { grid } = useGame();
  const { currentTheme } = useTheme();

  if (!grid || grid.length === 0) return null;

  const size = grid.length;
  const cellSize = Math.min(40, Math.floor(Math.min(window.innerWidth - 32, window.innerHeight - 300) / size));

  return (
    <div className="flex items-center justify-center p-4 overflow-auto">
      <div
        data-testid="game-board"
        className="gap-1 rounded-lg p-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
          backgroundColor: '#18181B',
          boxShadow: currentTheme.glow
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              cell={cell}
            />
          ))
        )}
      </div>
    </div>
  );
};
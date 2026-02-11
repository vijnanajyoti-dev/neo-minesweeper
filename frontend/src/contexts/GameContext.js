import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import analytics from '@/utils/analytics';
import { storage } from '@/utils/storage';
import adManager from '@/utils/adManager';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

// Difficulty presets
const DIFFICULTIES = {
  easy: { name: 'Easy', mineRatio: 0.12, gridSize: 8 },
  medium: { name: 'Medium', mineRatio: 0.15, gridSize: 10 },
  hard: { name: 'Hard', mineRatio: 0.20, gridSize: 16 }
};

const createEmptyGrid = (rows, cols) => {
  return Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }))
  );
};

const placeMines = (grid, rows, cols, mineCount, firstClickRow, firstClickCol) => {
  const mines = [];
  while (mines.length < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    const isFirstClick = row === firstClickRow && col === firstClickCol;
    const isAdjacent = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;
    
    if (!isFirstClick && !isAdjacent && !grid[row][col].isMine) {
      grid[row][col].isMine = true;
      mines.push([row, col]);
    }
  }
  
  // Calculate neighbor counts
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!grid[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              if (grid[newRow][newCol].isMine) count++;
            }
          }
        }
        grid[row][col].neighborMines = count;
      }
    }
  }
  
  return grid;
};

export const GameProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => storage.loadPreferences());
  const [theme, setTheme] = useState(preferences.theme);
  const [difficulty, setDifficulty] = useState(preferences.difficulty);
  const [gridSize, setGridSize] = useState(DIFFICULTIES[preferences.difficulty].gridSize);
  const [customMode, setCustomMode] = useState(false);
  const [grid, setGrid] = useState([]);
  const [gameStatus, setGameStatus] = useState('setup');
  const [timer, setTimer] = useState(0);
  const [mineCount, setMineCount] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);
  const [flagMode, setFlagMode] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Save preferences when they change
  useEffect(() => {
    const prefs = {
      theme,
      gridSize,
      difficulty,
      soundEnabled,
      adsEnabled: adManager.adsEnabled
    };
    storage.savePreferences(prefs);
  }, [theme, gridSize, difficulty, soundEnabled]);

  const startNewGame = useCallback((size = gridSize, selectedTheme = theme, selectedDifficulty = difficulty) => {
    const rows = size;
    const cols = size;
    const difficultyConfig = DIFFICULTIES[selectedDifficulty] || DIFFICULTIES.medium;
    const mineRatio = customMode ? 0.15 : difficultyConfig.mineRatio;
    const mines = Math.floor(rows * cols * mineRatio);
    
    setTheme(selectedTheme);
    setDifficulty(selectedDifficulty);
    setGridSize(size);
    setGrid(createEmptyGrid(rows, cols));
    setGameStatus('playing');
    setTimer(0);
    setMineCount(mines);
    setFlagCount(0);
    setFirstClick(true);
    setGameStartTime(Date.now());
    
    // Track game start
    analytics.trackGameStart(selectedDifficulty);
  }, [gridSize, theme, difficulty, customMode]);

  const revealCell = useCallback((row, col) => {
    if (gameStatus !== 'playing') return;
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      
      if (cell.isRevealed || cell.isFlagged) return prevGrid;
      
      // First click - place mines
      if (firstClick) {
        setFirstClick(false);
        placeMines(newGrid, newGrid.length, newGrid[0].length, mineCount, row, col);
      }
      
      // Clicked on mine - GAME OVER
      if (cell.isMine) {
        // Reveal all mines first
        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[0].length; c++) {
            if (newGrid[r][c].isMine) {
              newGrid[r][c].isRevealed = true;
            }
          }
        }
        
        // Delay game over modal to show mines
        setTimeout(() => {
          setGameStatus('lost');
          const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
          analytics.trackGameEnd(difficulty, false, playTime);
          
          // Show interstitial ad occasionally
          if (adManager.shouldShowInterstitial()) {
            adManager.showInterstitial();
          }
        }, 800);
        
        return newGrid;
      }
      
      // Flood fill for empty cells
      const flood = (r, c) => {
        if (r < 0 || r >= newGrid.length || c < 0 || c >= newGrid[0].length) return;
        if (newGrid[r][c].isRevealed || newGrid[r][c].isMine || newGrid[r][c].isFlagged) return;
        
        newGrid[r][c].isRevealed = true;
        
        if (newGrid[r][c].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              flood(r + dr, c + dc);
            }
          }
        }
      };
      
      flood(row, col);
      
      // Check win condition
      let unrevealedCount = 0;
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[0].length; c++) {
          if (!newGrid[r][c].isRevealed && !newGrid[r][c].isMine) {
            unrevealedCount++;
          }
        }
      }
      
      if (unrevealedCount === 0) {
        setGameStatus('won');
        const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
        analytics.trackGameEnd(difficulty, true, playTime);
        storage.saveLeaderboardEntry(difficulty, playTime, gridSize);
      }
      
      return newGrid;
    });
  }, [gameStatus, firstClick, mineCount, gameStartTime, difficulty, gridSize]);

  const toggleFlag = useCallback((row, col) => {
    if (gameStatus !== 'playing') return;
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      
      if (cell.isRevealed) return prevGrid;
      
      cell.isFlagged = !cell.isFlagged;
      setFlagCount(prev => cell.isFlagged ? prev + 1 : prev - 1);
      
      return newGrid;
    });
  }, [gameStatus]);

  const value = {
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    gridSize,
    setGridSize,
    customMode,
    setCustomMode,
    grid,
    gameStatus,
    timer,
    mineCount,
    flagCount,
    soundEnabled,
    setSoundEnabled,
    flagMode,
    setFlagMode,
    startNewGame,
    revealCell,
    toggleFlag,
    DIFFICULTIES
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

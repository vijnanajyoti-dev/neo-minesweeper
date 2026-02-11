import React, { createContext, useContext } from 'react';

const themes = {
  bomb: {
    name: 'Classic Danger',
    primary: '#EF4444',
    glow: '0 0 20px rgba(239, 68, 68, 0.5)',
    icon: 'Bomb'
  },
  soldier: {
    name: 'Tactical Ops',
    primary: '#22C55E',
    glow: '0 0 20px rgba(34, 197, 94, 0.5)',
    icon: 'Skull'
  },
  gun: {
    name: 'Cyber Arsenal',
    primary: '#3B82F6',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
    icon: 'Crosshair'
  },
  sword: {
    name: 'Knight\'s Quest',
    primary: '#A855F7',
    glow: '0 0 20px rgba(168, 85, 247, 0.5)',
    icon: 'Swords'
  },
  animal: {
    name: 'Wild Safari',
    primary: '#F97316',
    glow: '0 0 20px rgba(249, 115, 22, 0.5)',
    icon: 'PawPrint'
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, currentTheme }) => {
  const value = {
    themes,
    currentTheme: themes[currentTheme] || themes.bomb,
    currentThemeKey: currentTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
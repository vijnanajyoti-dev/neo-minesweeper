import React, { useState, useEffect } from 'react';
import '@/App.css';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/game/Header';
import { Board } from '@/components/game/Board';
import { SetupModal } from '@/components/game/SetupModal';
import { GameOverModal } from '@/components/game/GameOverModal';
import { BottomControls } from '@/components/game/BottomControls';
import { Leaderboard } from '@/components/game/Leaderboard';
import { StatsModal } from '@/components/game/StatsModal';
import adManager from '@/utils/adManager';

const GameContent = () => {
  const { gameStatus, startNewGame, theme } = useGame();
  const [showSetup, setShowSetup] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (gameStatus === 'setup') {
      setShowSetup(true);
    }
  }, [gameStatus]);

  // Initialize banner ad
  useEffect(() => {
    if (gameStatus === 'playing') {
      setTimeout(() => {
        adManager.initializeBannerAd('banner-ad-container');
      }, 1000);
    }
    
    return () => {
      adManager.removeBannerAd('banner-ad-container');
    };
  }, [gameStatus]);

  const handleStart = (gridSize, selectedTheme, selectedDifficulty) => {
    startNewGame(gridSize, selectedTheme, selectedDifficulty);
    setShowSetup(false);
  };

  const handleRestart = () => {
    startNewGame();
  };

  const handleHome = () => {
  setShowSetup(true);
  startNewGame(); // reset game state so GameOverModal closes
};

  return (
    <ThemeProvider currentTheme={theme}>
      <div className="min-h-screen bg-[#09090B] pb-16 md:pb-4" data-testid="game-container">
        <Header 
          onSettings={() => setShowSetup(true)}
          onLeaderboard={() => setShowLeaderboard(true)}
          onStats={() => setShowStats(true)}
        />
        
        {gameStatus !== 'setup' && (
          <>
            {/* Banner Ad Container */}
            <div className="max-w-4xl mx-auto px-4 pt-2">
              <div id="banner-ad-container" className="w-full"></div>
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
              <Board />
            </div>
          </>
        )}

        <SetupModal
          isOpen={showSetup}
          onClose={() => gameStatus !== 'setup' && setShowSetup(false)}
          onStart={handleStart}
        />

        <GameOverModal
          onRestart={handleRestart}
          onHome={handleHome}
        />

        <Leaderboard
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />

        <StatsModal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />

        <BottomControls />
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <div className="App">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
}

export default App;

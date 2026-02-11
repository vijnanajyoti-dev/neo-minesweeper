// Local storage utility for user preferences and game data

const STORAGE_KEYS = {
  USER_PREFS: 'neo_minesweeper_prefs',
  LEADERBOARD: 'neo_minesweeper_leaderboard',
  STATS: 'neo_minesweeper_stats'
};

export const storage = {
  // User preferences
  savePreferences(prefs) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(prefs));
      return true;
    } catch (e) {
      console.error('Failed to save preferences:', e);
      return false;
    }
  },

  loadPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load preferences:', e);
    }
    
    return {
      theme: 'bomb',
      gridSize: 10,
      difficulty: 'medium',
      soundEnabled: true,
      adsEnabled: true
    };
  },

  // Leaderboard
  saveLeaderboardEntry(difficulty, time, gridSize) {
    try {
      const leaderboard = this.loadLeaderboard();
      
      if (!leaderboard[difficulty]) {
        leaderboard[difficulty] = [];
      }
      
      leaderboard[difficulty].push({
        time,
        gridSize,
        date: new Date().toISOString(),
        id: Date.now()
      });
      
      // Keep only top 10
      leaderboard[difficulty].sort((a, b) => a.time - b.time);
      leaderboard[difficulty] = leaderboard[difficulty].slice(0, 10);
      
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
      return true;
    } catch (e) {
      console.error('Failed to save leaderboard entry:', e);
      return false;
    }
  },

  loadLeaderboard() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
    }
    
    return {
      easy: [],
      medium: [],
      hard: []
    };
  },

  clearLeaderboard() {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
  },

  // Stats
  saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      return true;
    } catch (e) {
      console.error('Failed to save stats:', e);
      return false;
    }
  },

  loadStats() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
    
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalPlayTime: 0,
      bestTimes: {
        easy: null,
        medium: null,
        hard: null
      }
    };
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
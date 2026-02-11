// Analytics tracking system for user engagement metrics

const ANALYTICS_KEY = 'neo_minesweeper_analytics';
const SESSION_KEY = 'neo_minesweeper_session';

class Analytics {
  constructor() {
    this.data = this.loadAnalytics();
    this.sessionId = this.initSession();
  }

  loadAnalytics() {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
    
    return {
      userId: this.generateUserId(),
      firstVisit: new Date().toISOString(),
      totalSessions: 0,
      totalGamesPlayed: 0,
      totalWins: 0,
      totalLosses: 0,
      totalPlayTime: 0,
      gamesByDifficulty: {
        easy: { played: 0, won: 0, lost: 0, bestTime: null },
        medium: { played: 0, won: 0, lost: 0, bestTime: null },
        hard: { played: 0, won: 0, lost: 0, bestTime: null }
      },
      dailyActiveUsers: {},
      lastVisit: new Date().toISOString(),
      retention: {
        day1: false,
        day7: false,
        day30: false
      }
    };
  }

  saveAnalytics() {
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save analytics:', e);
    }
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  initSession() {
    const sessionId = 'session_' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    
    // Track DAU
    this.data.dailyActiveUsers[today] = (this.data.dailyActiveUsers[today] || 0) + 1;
    this.data.totalSessions++;
    this.data.lastVisit = new Date().toISOString();
    
    // Calculate retention
    this.calculateRetention();
    
    this.saveAnalytics();
    sessionStorage.setItem(SESSION_KEY, sessionId);
    
    return sessionId;
  }

  calculateRetention() {
    const firstVisit = new Date(this.data.firstVisit);
    const now = new Date();
    const daysDiff = Math.floor((now - firstVisit) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 1 && !this.data.retention.day1) {
      this.data.retention.day1 = true;
    }
    if (daysDiff >= 7 && !this.data.retention.day7) {
      this.data.retention.day7 = true;
    }
    if (daysDiff >= 30 && !this.data.retention.day30) {
      this.data.retention.day30 = true;
    }
  }

  trackGameStart(difficulty) {
    this.data.totalGamesPlayed++;
    if (this.data.gamesByDifficulty[difficulty]) {
      this.data.gamesByDifficulty[difficulty].played++;
    }
    this.saveAnalytics();
  }

  trackGameEnd(difficulty, won, time) {
    if (won) {
      this.data.totalWins++;
      if (this.data.gamesByDifficulty[difficulty]) {
        this.data.gamesByDifficulty[difficulty].won++;
        
        // Update best time
        const currentBest = this.data.gamesByDifficulty[difficulty].bestTime;
        if (!currentBest || time < currentBest) {
          this.data.gamesByDifficulty[difficulty].bestTime = time;
        }
      }
    } else {
      this.data.totalLosses++;
      if (this.data.gamesByDifficulty[difficulty]) {
        this.data.gamesByDifficulty[difficulty].lost++;
      }
    }
    
    this.data.totalPlayTime += time;
    this.saveAnalytics();
  }

  getStats() {
    const winRate = this.data.totalGamesPlayed > 0 
      ? (this.data.totalWins / this.data.totalGamesPlayed * 100).toFixed(1)
      : 0;
    
    const avgPlayTime = this.data.totalGamesPlayed > 0
      ? Math.floor(this.data.totalPlayTime / this.data.totalGamesPlayed)
      : 0;
    
    return {
      ...this.data,
      winRate,
      avgPlayTime,
      lossRate: (100 - winRate).toFixed(1)
    };
  }

  getDAU(days = 7) {
    const dau = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      dau.push({
        date: dateKey,
        users: this.data.dailyActiveUsers[dateKey] || 0
      });
    }
    
    return dau;
  }

  reset() {
    localStorage.removeItem(ANALYTICS_KEY);
    this.data = this.loadAnalytics();
    this.saveAnalytics();
  }
}

export default new Analytics();
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Trophy, Clock, Target } from 'lucide-react';
import analytics from '@/utils/analytics';

export const StatsModal = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStats(analytics.getStats());
    }
  }, [isOpen]);

  if (!stats) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="stats-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl bg-[#18181B] rounded-2xl border border-[#27272A] p-6 max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 size={28} className="text-[#22C55E]" />
                <h2 className="text-2xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Your Statistics
                </h2>
              </div>
              <button
                data-testid="close-stats-btn"
                onClick={onClose}
                className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors"
              >
                <X size={20} className="text-[#FAFAFA]" />
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-[#09090B] p-4 rounded-lg border border-[#27272A]">
                <Target className="text-[#3B82F6] mb-2" size={20} />
                <div className="text-2xl font-bold text-[#FAFAFA] font-mono">{stats.totalGamesPlayed}</div>
                <div className="text-xs text-[#A1A1AA]">Games Played</div>
              </div>
              
              <div className="bg-[#09090B] p-4 rounded-lg border border-[#27272A]">
                <Trophy className="text-[#22C55E] mb-2" size={20} />
                <div className="text-2xl font-bold text-[#FAFAFA] font-mono">{stats.totalWins}</div>
                <div className="text-xs text-[#A1A1AA]">Wins</div>
              </div>
              
              <div className="bg-[#09090B] p-4 rounded-lg border border-[#27272A]">
                <TrendingUp className="text-[#F97316] mb-2" size={20} />
                <div className="text-2xl font-bold text-[#FAFAFA] font-mono">{stats.winRate}%</div>
                <div className="text-xs text-[#A1A1AA]">Win Rate</div>
              </div>
              
              <div className="bg-[#09090B] p-4 rounded-lg border border-[#27272A]">
                <Clock className="text-[#A855F7] mb-2" size={20} />
                <div className="text-2xl font-bold text-[#FAFAFA] font-mono">{stats.totalSessions}</div>
                <div className="text-xs text-[#A1A1AA]">Sessions</div>
              </div>
            </div>

            {/* By Difficulty */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#FAFAFA] mb-3">By Difficulty</h3>
              <div className="space-y-3">
                {Object.entries(stats.gamesByDifficulty).map(([diff, data]) => (
                  <div key={diff} className="bg-[#09090B] p-4 rounded-lg border border-[#27272A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#FAFAFA] font-semibold capitalize">{diff}</span>
                      <span className="text-[#A1A1AA] text-sm">{data.played} games</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-[#22C55E] font-mono font-bold">{data.won}</div>
                        <div className="text-[#A1A1AA] text-xs">Won</div>
                      </div>
                      <div>
                        <div className="text-[#EF4444] font-mono font-bold">{data.lost}</div>
                        <div className="text-[#A1A1AA] text-xs">Lost</div>
                      </div>
                      <div>
                        <div className="text-[#3B82F6] font-mono font-bold">
                          {data.bestTime ? formatTime(data.bestTime) : '-'}
                        </div>
                        <div className="text-[#A1A1AA] text-xs">Best Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention */}
            <div className="bg-[#09090B] p-4 rounded-lg border border-[#27272A]">
              <h3 className="text-lg font-bold text-[#FAFAFA] mb-3">Retention</h3>
              <div className="flex gap-3">
                <div className={`flex-1 p-3 rounded-lg ${
                  stats.retention.day1 ? 'bg-[#22C55E]/20 border-[#22C55E]' : 'bg-[#27272A]'
                } border`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{stats.retention.day1 ? '✓' : '○'}</div>
                    <div className="text-xs text-[#A1A1AA]">Day 1</div>
                  </div>
                </div>
                <div className={`flex-1 p-3 rounded-lg ${
                  stats.retention.day7 ? 'bg-[#22C55E]/20 border-[#22C55E]' : 'bg-[#27272A]'
                } border`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{stats.retention.day7 ? '✓' : '○'}</div>
                    <div className="text-xs text-[#A1A1AA]">Day 7</div>
                  </div>
                </div>
                <div className={`flex-1 p-3 rounded-lg ${
                  stats.retention.day30 ? 'bg-[#22C55E]/20 border-[#22C55E]' : 'bg-[#27272A]'
                } border`}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{stats.retention.day30 ? '✓' : '○'}</div>
                    <div className="text-xs text-[#A1A1AA]">Day 30</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Clock } from 'lucide-react';
import { storage } from '@/utils/storage';

export const Leaderboard = ({ isOpen, onClose }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [leaderboard, setLeaderboard] = useState({ easy: [], medium: [], hard: [] });

  useEffect(() => {
    if (isOpen) {
      setLeaderboard(storage.loadLeaderboard());
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const entries = leaderboard[selectedDifficulty] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="leaderboard-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg bg-[#18181B] rounded-2xl border border-[#27272A] p-6 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-yellow-400" />
                <h2 className="text-2xl font-bold text-[#FAFAFA]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Leaderboard
                </h2>
              </div>
              <button
                data-testid="close-leaderboard-btn"
                onClick={onClose}
                className="p-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] transition-colors"
              >
                <X size={20} className="text-[#FAFAFA]" />
              </button>
            </div>

            {/* Difficulty selector */}
            <div className="flex gap-2 mb-6">
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  data-testid={`leaderboard-${diff}-btn`}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46]'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            {/* Leaderboard entries */}
            <div className="space-y-2">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-[#A1A1AA]">
                  <Trophy size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No records yet</p>
                  <p className="text-sm mt-1">Be the first to win!</p>
                </div>
              ) : (
                entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    data-testid={`leaderboard-entry-${index}`}
                    className="flex items-center gap-3 p-3 bg-[#09090B] rounded-lg border border-[#27272A]"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: index === 0 ? '#EAB308' : index === 1 ? '#94A3B8' : index === 2 ? '#CD7F32' : '#27272A',
                        color: index < 3 ? '#000' : '#FAFAFA'
                      }}
                    >
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[#FAFAFA] font-mono font-bold">
                        <Clock size={14} />
                        {formatTime(entry.time)}
                      </div>
                      <div className="text-xs text-[#A1A1AA] mt-1">
                        {entry.gridSize}×{entry.gridSize} • {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {entries.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all leaderboard entries?')) {
                    storage.clearLeaderboard();
                    setLeaderboard({ easy: [], medium: [], hard: [] });
                  }
                }}
                className="w-full mt-4 py-2 px-4 rounded-lg bg-[#27272A] text-[#A1A1AA] text-sm hover:bg-[#3F3F46] transition-colors"
              >
                Clear Leaderboard
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
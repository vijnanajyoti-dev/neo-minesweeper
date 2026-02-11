import React from 'react';
import { motion } from 'framer-motion';
import { Bomb, Skull, Crosshair, Swords, PawPrint, Check } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

const themeConfig = {
  bomb: {
    name: 'Classic Danger',
    primary: '#EF4444',
    icon: Bomb
  },
  soldier: {
    name: 'Tactical Ops',
    primary: '#22C55E',
    icon: Skull
  },
  gun: {
    name: 'Cyber Arsenal',
    primary: '#3B82F6',
    icon: Crosshair
  },
  sword: {
    name: 'Knight\'s Quest',
    primary: '#A855F7',
    icon: Swords
  },
  animal: {
    name: 'Wild Safari',
    primary: '#F97316',
    icon: PawPrint
  }
};

export const ThemeSelector = ({ selectedTheme, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Object.entries(themeConfig).map(([key, config]) => {
        const Icon = config.icon;
        const isSelected = selectedTheme === key;
        
        return (
          <motion.button
            key={key}
            data-testid={`theme-${key}-btn`}
            onClick={() => onSelect(key)}
            className="relative p-4 rounded-xl bg-[#18181B] border-2 transition-all"
            style={{
              borderColor: isSelected ? config.primary : '#27272A'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSelected && (
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.primary }}
              >
                <Check size={14} className="text-white" />
              </div>
            )}
            
            <div className="flex flex-col items-center gap-2">
              <Icon
                size={32}
                style={{ color: config.primary }}
              />
              <span className="text-xs font-medium text-[#FAFAFA]">
                {config.name}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
'use client';

import { type CaptionPosition } from '@/lib/types';
import { ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface PositionSelectorProps {
  selected: CaptionPosition;
  onSelect: (position: CaptionPosition) => void;
  disabled?: boolean;
}

const positions: { id: CaptionPosition; label: string; icon: typeof ArrowUp }[] = [
  { id: 'top', label: 'Top', icon: ArrowUp },
  { id: 'center', label: 'Center', icon: Minus },
  { id: 'bottom', label: 'Bottom', icon: ArrowDown },
];

export default function PositionSelector({ 
  selected, 
  onSelect, 
  disabled 
}: PositionSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Position</h3>
      
      <div className="flex gap-2">
        {positions.map((pos) => {
          const Icon = pos.icon;
          return (
            <button
              key={pos.id}
              onClick={() => onSelect(pos.id)}
              disabled={disabled}
              className={`
                flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200
                flex flex-col items-center gap-1
                ${selected === pos.id 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className={`w-5 h-5 ${selected === pos.id ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className={`text-sm ${selected === pos.id ? 'text-white' : 'text-gray-400'}`}>
                {pos.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

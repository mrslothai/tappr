'use client';

import { FONT_OPTIONS, type FontFamily } from '@/lib/types';
import { Check } from 'lucide-react';

interface FontSelectorProps {
  selected: FontFamily;
  onSelect: (font: FontFamily) => void;
  disabled?: boolean;
}

export default function FontSelector({ 
  selected, 
  onSelect, 
  disabled 
}: FontSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Font</h3>
      
      <div className="flex flex-wrap gap-2">
        {FONT_OPTIONS.map((font) => (
          <button
            key={font.family}
            onClick={() => onSelect(font.family)}
            disabled={disabled}
            className={`
              relative px-4 py-3 rounded-xl border-2 transition-all duration-200
              flex items-center gap-3
              ${selected === font.family 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Selection indicator */}
            {selected === font.family && (
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
            {/* Font preview */}
            <div className="text-left">
              <span 
                className="block text-white text-lg"
                style={{ 
                  fontFamily: font.family, 
                  fontWeight: font.weight 
                }}
              >
                {font.displayName}
              </span>
              <span className="text-xs text-gray-400">{font.style}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

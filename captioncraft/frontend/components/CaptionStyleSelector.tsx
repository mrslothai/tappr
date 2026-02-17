'use client';

import { CAPTION_STYLES, type CaptionStyle } from '@/lib/types';
import { Check } from 'lucide-react';

interface CaptionStyleSelectorProps {
  selected: CaptionStyle;
  onSelect: (style: CaptionStyle) => void;
  disabled?: boolean;
}

export default function CaptionStyleSelector({ 
  selected, 
  onSelect, 
  disabled 
}: CaptionStyleSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Caption Style</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {CAPTION_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              text-left group
              ${selected === style.id 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Selection indicator */}
            {selected === style.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
            {/* Preview text */}
            <div 
              className="mb-3 py-2 px-3 rounded-lg bg-gray-900/80 flex items-center justify-center"
              style={{ minHeight: '48px' }}
            >
              <span
                className={`
                  text-lg font-bold transition-all
                  ${style.id === 'classic' ? 'text-white [text-shadow:_2px_2px_0_#000,_-2px_2px_0_#000,_2px_-2px_0_#000,_-2px_-2px_0_#000]' : ''}
                  ${style.id === 'highlight' ? 'bg-yellow-400 text-black px-2 py-0.5' : ''}
                  ${style.id === 'colorful' ? 'text-pink-400 [text-shadow:_0_0_20px_#ff88ff]' : ''}
                  ${style.id === 'minimal' ? 'text-white/90 text-base font-normal' : ''}
                `}
              >
                Sample
              </span>
            </div>
            
            {/* Style info */}
            <div>
              <h4 className="font-semibold text-white text-sm">{style.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{style.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

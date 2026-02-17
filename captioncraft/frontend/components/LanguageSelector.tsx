'use client';

import { LanguageOption, LANGUAGE_OPTIONS, CaptionLanguage } from '@/lib/types';

interface LanguageSelectorProps {
  selected: CaptionLanguage;
  onSelect: (language: CaptionLanguage) => void;
}

export default function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          Language
        </label>
        <span className="text-xs text-gray-500">
          Speech recognition
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={`
              p-3 rounded-lg border text-left transition-all
              ${selected === lang.code
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
              }
            `}
          >
            <div className="font-medium text-sm">{lang.name}</div>
            <div className="text-xs opacity-70 mt-1">{lang.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

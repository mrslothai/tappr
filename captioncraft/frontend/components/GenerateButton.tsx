'use client';

import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export default function GenerateButton({ 
  onClick, 
  disabled, 
  isProcessing 
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`
        w-full py-4 px-6 rounded-xl font-semibold text-lg
        flex items-center justify-center gap-3
        transition-all duration-300
        bg-gradient-to-r from-purple-500 to-pink-500 
        hover:from-purple-600 hover:to-pink-600
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:from-purple-500 disabled:hover:to-pink-500
        text-white shadow-lg shadow-purple-500/25
        hover:shadow-xl hover:shadow-purple-500/30
        hover:scale-[1.02] active:scale-[0.98]
      `}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Sparkles className="w-6 h-6" />
          Generate Captions
        </>
      )}
    </button>
  );
}

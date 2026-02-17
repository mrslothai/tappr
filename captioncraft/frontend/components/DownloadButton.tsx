'use client';

import { useState } from 'react';
import { Download, Loader2, Check, ExternalLink } from 'lucide-react';

interface DownloadButtonProps {
  resultUrl: string;
  filename?: string;
}

export default function DownloadButton({ 
  resultUrl, 
  filename = 'captioned-video.mp4' 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      setIsComplete(true);
      
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg
          flex items-center justify-center gap-3
          transition-all duration-300
          ${isComplete 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'}
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white shadow-lg shadow-purple-500/25
        `}
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Downloading...
          </>
        ) : isComplete ? (
          <>
            <Check className="w-6 h-6" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="w-6 h-6" />
            Download Video
          </>
        )}
      </button>

      {/* Open in new tab option */}
      <a
        href={resultUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open in new tab
      </a>
    </div>
  );
}

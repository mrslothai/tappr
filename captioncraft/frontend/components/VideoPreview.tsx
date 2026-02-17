'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { type CaptionSettings } from '@/lib/types';

interface VideoPreviewProps {
  videoUrl: string;
  settings: CaptionSettings;
  captionText?: string;
}

export default function VideoPreview({ 
  videoUrl, 
  settings,
  captionText = "Your captions will appear here"
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const getCaptionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      fontFamily: settings.font,
      fontWeight: 700,
      fontSize: settings.style === 'minimal' ? '16px' : '24px',
      textAlign: 'center',
      padding: '8px 16px',
      maxWidth: '90%',
    };

    switch (settings.style) {
      case 'classic':
        return {
          ...baseStyles,
          color: '#FFFFFF',
          textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 2px 0 0 #000, -2px 0 0 #000',
        };
      case 'highlight':
        return {
          ...baseStyles,
          color: '#000000',
          backgroundColor: '#FFFF00',
          borderRadius: '4px',
        };
      case 'colorful':
        return {
          ...baseStyles,
          color: '#FF88FF',
          textShadow: '0 0 20px #FF88FF, 0 0 40px #FF88FF',
        };
      case 'minimal':
        return {
          ...baseStyles,
          color: '#FFFFFF',
          fontWeight: 500,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '4px',
        };
      default:
        return baseStyles;
    }
  };

  const getPositionStyles = (): React.CSSProperties => {
    switch (settings.position) {
      case 'top':
        return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom':
      default:
        return { bottom: '15%', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Preview</h3>
      
      <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-w-[300px] mx-auto">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop
        />
        
        {/* Caption overlay */}
        <div 
          className="absolute pointer-events-none"
          style={{ ...getPositionStyles(), position: 'absolute' }}
        >
          <span style={getCaptionStyles()}>
            {captionText}
          </span>
        </div>

        {/* Controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          {/* Play button center */}
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            {/* Progress bar */}
            <div 
              className="h-1 bg-white/30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

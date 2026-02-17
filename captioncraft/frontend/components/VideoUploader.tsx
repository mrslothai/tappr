'use client';

import { useCallback, useState } from 'react';
import { Upload, Film, X, AlertCircle } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelect: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FORMATS = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];

export default function VideoUploader({ onVideoSelect, disabled }: VideoUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return 'Please upload a valid video file (MP4, MOV, WebM, AVI)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 100MB';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onVideoSelect(file, previewUrl);
  }, [onVideoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 md:p-12
          transition-all duration-300 ease-out
          ${isDragActive 
            ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragActive 
              ? 'bg-purple-500/20 text-purple-400' 
              : 'bg-gray-700/50 text-gray-400'}
          `}>
            {isDragActive ? (
              <Film className="w-12 h-12" />
            ) : (
              <Upload className="w-12 h-12" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragActive ? 'Drop your video here' : 'Upload your video'}
            </h3>
            <p className="text-gray-400 text-sm">
              Drag and drop or click to browse
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-700/50 rounded-full">MP4</span>
            <span className="px-2 py-1 bg-gray-700/50 rounded-full">MOV</span>
            <span className="px-2 py-1 bg-gray-700/50 rounded-full">WebM</span>
            <span className="px-2 py-1 bg-gray-700/50 rounded-full">Max 100MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

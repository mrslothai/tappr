'use client';

import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';
import { type ProcessingJob } from '@/lib/types';

interface ProgressIndicatorProps {
  job: ProcessingJob;
}

const steps = [
  { id: 'uploading', label: 'Uploading video' },
  { id: 'extracting', label: 'Extracting audio' },
  { id: 'transcribing', label: 'Transcribing speech' },
  { id: 'rendering', label: 'Rendering captions' },
  { id: 'complete', label: 'Complete!' },
];

export default function ProgressIndicator({ job }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(s => s.id === job.status);
  const isError = job.status === 'error';

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <div className="space-y-4">
        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Processing</span>
            <span className="text-white font-medium">{Math.round(job.progress)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isError ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            const isErrorStep = isError && isCurrent;

            return (
              <div 
                key={step.id}
                className={`flex items-center gap-3 transition-opacity ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {isErrorStep ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm ${
                  isErrorStep 
                    ? 'text-red-400' 
                    : isCompleted 
                      ? 'text-green-400' 
                      : isCurrent 
                        ? 'text-white' 
                        : 'text-gray-500'
                }`}>
                  {step.label}
                </span>

                {/* Current step indicator */}
                {isCurrent && !isError && (
                  <span className="ml-auto text-xs text-purple-400 animate-pulse">
                    Processing...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {isError && job.error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{job.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

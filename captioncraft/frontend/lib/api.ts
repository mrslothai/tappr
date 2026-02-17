// API client for CaptionCraft backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface UploadResponse {
  success: boolean;
  jobId: string;
  message: string;
}

export interface JobStatus {
  id: string;
  status: 'uploading' | 'extracting' | 'transcribing' | 'rendering' | 'complete' | 'error';
  progress: number;
  resultUrl?: string;
  error?: string;
}

export interface CaptionOptions {
  style: string;
  font: string;
  position: string;
}

/**
 * Upload a video for captioning
 */
export async function uploadVideo(
  file: File,
  options: CaptionOptions
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('style', options.style);
  formData.append('font', options.font);
  formData.append('position', options.position);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

/**
 * Check the status of a processing job
 */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_URL}/api/status/${jobId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get status');
  }

  return response.json();
}

/**
 * Poll for job completion
 */
export async function waitForJob(
  jobId: string,
  onProgress?: (status: JobStatus) => void,
  pollInterval = 1000
): Promise<JobStatus> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const status = await getJobStatus(jobId);
        
        if (onProgress) {
          onProgress(status);
        }

        if (status.status === 'complete') {
          resolve(status);
        } else if (status.status === 'error') {
          reject(new Error(status.error || 'Processing failed'));
        } else {
          setTimeout(poll, pollInterval);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

/**
 * Get download URL for a completed job
 */
export function getDownloadUrl(jobId: string): string {
  return `${API_URL}/api/download/${jobId}`;
}

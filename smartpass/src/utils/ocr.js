import { createWorker } from 'tesseract.js';

/**
 * Extract text from boarding pass image using Tesseract OCR
 * @param {File|string} image - Image file or data URL
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromImage(image) {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(image);
    return text;
  } finally {
    await worker.terminate();
  }
}

/**
 * Extract text with progress callback
 * @param {File|string} image 
 * @param {Function} onProgress - Progress callback (0-1)
 * @returns {Promise<string>}
 */
export async function extractTextWithProgress(image, onProgress) {
  const worker = await createWorker('eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text') {
        onProgress(m.progress);
      }
    }
  });
  
  try {
    const { data: { text } } = await worker.recognize(image);
    return text;
  } finally {
    await worker.terminate();
  }
}

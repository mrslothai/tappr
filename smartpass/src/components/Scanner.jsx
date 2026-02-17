import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { extractTextWithProgress } from '../utils/ocr';
import { parseBoardingPass, isValidBoardingPass } from '../utils/parser';

// Configure PDF.js worker - use local bundled worker (not CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Scanner({ onPassScanned }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const convertPdfToImage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1); // Get first page

    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL('image/png');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    setError('');
    setProgress(0);

    try {
      let imageDataUrl;

      // Handle PDF files
      if (file.type === 'application/pdf') {
        setProgress(10);
        imageDataUrl = await convertPdfToImage(file);
      } else {
        // Handle image files
        imageDataUrl = await fileToDataURL(file);
      }

      // Show preview
      setPreview(imageDataUrl);
      setProgress(20);

      // Create a blob from the data URL for OCR
      const blob = await fetch(imageDataUrl).then(r => r.blob());
      
      // Extract text using OCR
      const text = await extractTextWithProgress(blob, (p) => {
        // Map OCR progress to 20-90%
        setProgress(20 + Math.round(p * 70));
      });

      setProgress(90);

      // Parse boarding pass data
      const passData = parseBoardingPass(text);

      if (!isValidBoardingPass(passData)) {
        setError('Could not extract valid boarding pass information. Please try again or enter details manually.');
        setLoading(false);
        return;
      }

      // Add image to pass data
      passData.imageData = imageDataUrl;

      setProgress(100);

      // Notify parent component
      onPassScanned(passData);
      
      // Reset
      setTimeout(() => {
        setPreview(null);
        setLoading(false);
        setProgress(0);
      }, 500);
      
    } catch (err) {
      console.error('Processing Error:', err);
      setError(`Failed to process file: ${err.message}. Please try again.`);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await handleFileUpload(file);
    event.target.value = ''; // Reset input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const fileToDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transition-all hover:shadow-xl">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Boarding Pass</h2>
          <p className="text-sm text-gray-500">PDF, PNG, JPG or screenshots</p>
        </div>
      </div>
      
      <div className="mb-4">
        <label
          htmlFor="boarding-pass-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : preview
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 bg-gradient-to-b from-gray-50 to-white hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {preview ? (
            <div className="relative w-full h-full p-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
              {!loading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 hover:opacity-100 transition-opacity bg-blue-600 px-4 py-2 rounded-lg font-medium">
                    Click to change
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="mb-2 text-lg font-semibold text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 mb-1">
                PDF, PNG, JPG or any screenshot
              </p>
              <p className="text-xs text-gray-400">
                Maximum file size: 10MB
              </p>
            </div>
          )}
          <input
            id="boarding-pass-upload"
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleImageUpload}
            disabled={loading}
          />
        </label>
      </div>

      {loading && (
        <div className="mb-4 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-sm font-medium text-blue-900">
                {progress < 20 ? 'Processing PDF...' : progress < 90 ? 'Extracting text...' : 'Almost done...'}
              </span>
            </div>
            <span className="text-sm font-bold text-blue-700">{progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 animate-shake">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p>
          Upload a photo or PDF of your boarding pass. Our AI will automatically extract flight details, passenger info, and create a scannable QR code.
        </p>
      </div>
    </div>
  );
}

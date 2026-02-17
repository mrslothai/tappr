// CaptionCraft Types

export type CaptionStyle = 'classic' | 'highlight' | 'colorful' | 'minimal';

export type FontFamily = 
  | 'Montserrat'
  | 'Poppins'
  | 'Inter'
  | 'Roboto'
  | 'Bebas Neue';

export type CaptionPosition = 'top' | 'center' | 'bottom';

export type CaptionLanguage = 'hi' | 'en' | 'hinglish';

export interface CaptionSettings {
  style: CaptionStyle;
  font: FontFamily;
  position: CaptionPosition;
  language: CaptionLanguage;
}

export interface ProcessingJob {
  id: string;
  status: 'uploading' | 'extracting' | 'transcribing' | 'rendering' | 'complete' | 'completed' | 'error';
  progress: number;
  videoUrl?: string;
  resultUrl?: string;
  error?: string;
}

export interface StylePreset {
  id: CaptionStyle;
  name: string;
  description: string;
  preview: {
    bgColor: string;
    textColor: string;
    outline: boolean;
    highlight: boolean;
  };
}

export interface FontOption {
  family: FontFamily;
  displayName: string;
  style: string;
  weight: number;
}

export const CAPTION_STYLES: StylePreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Bold white text with black outline',
    preview: {
      bgColor: 'transparent',
      textColor: '#FFFFFF',
      outline: true,
      highlight: false,
    },
  },
  {
    id: 'highlight',
    name: 'Highlight',
    description: 'Yellow background, TikTok style',
    preview: {
      bgColor: '#FFFF00',
      textColor: '#000000',
      outline: false,
      highlight: true,
    },
  },
  {
    id: 'colorful',
    name: 'Colorful',
    description: 'Pink gradient with glow effect',
    preview: {
      bgColor: 'transparent',
      textColor: '#FF88FF',
      outline: true,
      highlight: false,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, small text at bottom',
    preview: {
      bgColor: 'transparent',
      textColor: '#FFFFFF',
      outline: false,
      highlight: false,
    },
  },
];

export const FONT_OPTIONS: FontOption[] = [
  {
    family: 'Montserrat',
    displayName: 'Montserrat',
    style: 'Bold & Modern',
    weight: 700,
  },
  {
    family: 'Poppins',
    displayName: 'Poppins',
    style: 'Rounded & Friendly',
    weight: 600,
  },
  {
    family: 'Inter',
    displayName: 'Inter',
    style: 'Clean & Readable',
    weight: 600,
  },
  {
    family: 'Roboto',
    displayName: 'Roboto',
    style: 'Neutral & Clear',
    weight: 500,
  },
  {
    family: 'Bebas Neue',
    displayName: 'Bebas Neue',
    style: 'Tall & Dramatic',
    weight: 400,
  },
];

export interface LanguageOption {
  code: CaptionLanguage;
  name: string;
  description: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'hi',
    name: 'Hindi',
    description: 'हिन्दी (Devanagari script)',
  },
  {
    code: 'hinglish',
    name: 'Hinglish',
    description: 'Hindi in Roman script',
  },
  {
    code: 'en',
    name: 'English',
    description: 'English',
  },
];

# CaptionCraft Frontend

A modern Next.js 15 application for generating beautiful captions for your videos.

## Features

- 🎬 **Video Upload** - Drag & drop or click to upload (MP4, MOV, WebM, up to 100MB)
- 🎨 **4 Caption Styles** - Classic, Highlight, Colorful, Minimal
- 🔤 **5 Font Options** - Montserrat, Poppins, Inter, Roboto, Bebas Neue
- 📍 **Position Control** - Top, Center, or Bottom placement
- 👁️ **Live Preview** - See your captions before generating
- 📊 **Progress Tracking** - Real-time processing status
- 📥 **Easy Download** - One-click download of the final video

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Montserrat, Poppins, Inter, Roboto, Bebas Neue)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Cloudflare R2 (for production)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=captioncraft
R2_PUBLIC_URL=
```

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # Video upload endpoint
│   │   ├── status/[jobId]/      # Job status polling
│   │   └── download/[jobId]/    # Download endpoint
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Main app page
│   └── globals.css              # Global styles
├── components/
│   ├── VideoUploader.tsx        # Drag & drop upload
│   ├── VideoPreview.tsx         # Video player with caption overlay
│   ├── CaptionStyleSelector.tsx # Style picker (4 styles)
│   ├── FontSelector.tsx         # Font picker (5 fonts)
│   ├── PositionSelector.tsx     # Position picker
│   ├── GenerateButton.tsx       # Generate action button
│   ├── ProgressIndicator.tsx    # Processing progress
│   ├── DownloadButton.tsx       # Download action button
│   └── Header.tsx               # App header
├── lib/
│   ├── types.ts                 # TypeScript types
│   └── api.ts                   # API client utilities
└── public/                      # Static assets
```

## Caption Styles

| Style | Description |
|-------|-------------|
| **Classic** | Bold white text with black outline |
| **Highlight** | Yellow background, TikTok style |
| **Colorful** | Pink gradient with glow effect |
| **Minimal** | Clean, small text at bottom |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

```bash
# Or deploy via CLI
npx vercel
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Endpoints

### POST /api/upload

Upload a video for processing.

```typescript
// Request
FormData {
  video: File,
  style: 'classic' | 'highlight' | 'colorful' | 'minimal',
  font: string,
  position: 'top' | 'center' | 'bottom'
}

// Response
{
  success: boolean,
  jobId: string,
  message: string
}
```

### GET /api/status/[jobId]

Check processing status.

```typescript
// Response
{
  id: string,
  status: 'uploading' | 'extracting' | 'transcribing' | 'rendering' | 'complete' | 'error',
  progress: number,
  resultUrl?: string,
  error?: string
}
```

### GET /api/download/[jobId]

Get download URL for completed video.

## License

MIT

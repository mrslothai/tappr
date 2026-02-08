# CaptionCraft - Video Caption Generator
## Architecture Document for Claude Code

---

## 🎯 Project Overview

**Problem:** Rajesh makes Instagram reels and needs to add captions. Existing tools like diveo.io have limited fonts and expensive paid tiers.

**Solution:** Build a self-hosted video captioning tool that:
- Transcribes audio to text with timestamps
- Overlays stylish captions on video with custom fonts
- Exports the final video ready for Instagram

**Target User:** Content creators who want professional captions without expensive subscriptions.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Next.js on Vercel)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Upload    │  │   Preview   │  │   Download  │             │
│  │   Video     │  │   Captions  │  │   Result    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                (Node.js/Python on Railway)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Extract    │  │ Transcribe  │  │   Burn      │             │
│  │  Audio      │  │  (STT API)  │  │  Captions   │             │
│  │  (FFmpeg)   │  │             │  │  (FFmpeg)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
           ┌──────────────┐    ┌──────────────┐
           │   Storage    │    │   STT API    │
           │  (Cloudflare │    │ (AssemblyAI/ │
           │     R2)      │    │  Deepgram)   │
           └──────────────┘    └──────────────┘
```

---

## 📦 Tech Stack

### Frontend
| Component | Technology | Cost |
|-----------|------------|------|
| Framework | Next.js 15 (App Router) | Free |
| Styling | Tailwind CSS | Free |
| Hosting | Vercel | Free tier (100GB bandwidth) |
| State | React useState/useReducer | Free |

### Backend
| Component | Technology | Cost |
|-----------|------------|------|
| Runtime | Node.js or Python | Free |
| Hosting | Railway | $5/month (Hobby) |
| Video Processing | FFmpeg | Free (open source) |
| Font Rendering | Google Fonts + FFmpeg | Free |

### Storage
| Component | Technology | Cost |
|-----------|------------|------|
| Video Storage | Cloudflare R2 | $0.015/GB, 10GB free |
| Egress | Cloudflare R2 | **FREE** (no egress fees!) |

### Speech-to-Text (Choose ONE)
| Provider | Cost per Minute | Free Tier | Accuracy | Recommended |
|----------|-----------------|-----------|----------|-------------|
| **AssemblyAI** | $0.0025/min ($0.15/hr) | 185 hours FREE | Excellent | ✅ BEST VALUE |
| Deepgram Nova-3 | $0.0077/min | $200 credit | Excellent | Good backup |
| OpenAI Whisper | $0.006/min | None | Very Good | Expensive |
| Groq Whisper | ~$0.0001/min | Limited | Good | If available |

**Recommendation:** Start with **AssemblyAI** - 185 hours free + cheapest paid tier.

---

## 💰 Cost Analysis

### Per Video (1-minute Instagram Reel)
| Service | Cost |
|---------|------|
| Transcription (AssemblyAI) | $0.0025 |
| Storage (R2, 50MB video) | $0.00075 |
| Processing (Railway) | ~$0.001 |
| **Total per video** | **~$0.004** (less than half a cent!) |

### Monthly Estimates
| Usage | Transcription | Storage | Backend | Total |
|-------|---------------|---------|---------|-------|
| 100 videos/month | $0.25 | $0.75 | $5 | **~$6/month** |
| 500 videos/month | $1.25 | $3.75 | $5 | **~$10/month** |
| 1000 videos/month | $2.50 | $7.50 | $5 | **~$15/month** |

### First 3 Months (Free Tier)
- AssemblyAI: 185 hours = ~11,100 minutes = **11,100 reels FREE**
- Cloudflare R2: 10GB free = ~200 videos/month FREE
- Railway: $5/month (no free tier for always-on)
- **Estimated cost for first 3 months: ~$15 total**

---

## 🔧 Implementation Details

### 1. Frontend (Next.js)

```
/app
  /page.tsx                 # Main upload page
  /api
    /upload/route.ts        # Handle video upload
    /status/[id]/route.ts   # Check processing status
    /download/[id]/route.ts # Download result
/components
  /VideoUploader.tsx        # Drag-drop upload
  /CaptionPreview.tsx       # Live preview of captions
  /FontSelector.tsx         # Choose caption style
  /ProgressBar.tsx          # Processing progress
/lib
  /r2.ts                    # Cloudflare R2 client
```

### 2. Backend Processing Pipeline

```python
# Pseudocode for processing pipeline

def process_video(video_url, caption_style):
    # Step 1: Download video from R2
    video_path = download_from_r2(video_url)
    
    # Step 2: Extract audio
    audio_path = extract_audio(video_path)  # FFmpeg
    
    # Step 3: Transcribe with timestamps
    transcript = transcribe(audio_path)  # AssemblyAI
    # Returns: [{"text": "Hello", "start": 0.0, "end": 0.5}, ...]
    
    # Step 4: Generate ASS subtitle file with styling
    subtitle_file = generate_styled_subtitles(transcript, caption_style)
    
    # Step 5: Burn captions onto video
    output_path = burn_captions(video_path, subtitle_file)  # FFmpeg
    
    # Step 6: Upload result to R2
    result_url = upload_to_r2(output_path)
    
    return result_url
```

### 3. FFmpeg Caption Burning Command

```bash
# Burn ASS subtitles with custom fonts
ffmpeg -i input.mp4 \
  -vf "ass=captions.ass:fontsdir=/fonts" \
  -c:a copy \
  -c:v libx264 -preset fast -crf 23 \
  output.mp4
```

### 4. Caption Styles (ASS Format)

```ass
[Script Info]
Title: CaptionCraft Subtitles
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding

; Style 1: Bold White with Black Outline (Classic)
Style: Classic,Montserrat,72,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,2,10,10,50,1

; Style 2: Yellow Highlight (TikTok style)
Style: Highlight,Poppins,68,&H0000FFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,0,0,2,10,10,50,1

; Style 3: Gradient/Colorful
Style: Colorful,Inter,70,&H00FF88FF,&H0088FFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,3,2,2,10,10,50,1

; Style 4: Minimal (Small, Bottom)
Style: Minimal,Roboto,48,&H00FFFFFF,&H000000FF,&H00333333,&H00000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,30,1
```

---

## 🎨 Available Fonts (Google Fonts - FREE)

Include these fonts in the backend `/fonts` directory:

| Font | Style | Best For |
|------|-------|----------|
| **Montserrat** | Bold, Modern | Headlines, Impact |
| **Poppins** | Rounded, Friendly | Casual content |
| **Inter** | Clean, Readable | Professional |
| **Roboto** | Neutral | Subtitles |
| **Bebas Neue** | Tall, Condensed | Drama, Emphasis |
| **Oswald** | Strong, Narrow | Bold statements |
| **Playfair Display** | Elegant, Serif | Luxury, Formal |
| **Permanent Marker** | Handwritten | Fun, Casual |
| **Anton** | Heavy, Impact | Maximum emphasis |
| **Archivo Black** | Ultra Bold | Strong presence |

Download from: https://fonts.google.com/

---

## 🔌 Third-Party APIs

### AssemblyAI (Speech-to-Text)
```bash
# Get API key from: https://www.assemblyai.com/dashboard/signup
ASSEMBLYAI_API_KEY=your_key_here
```

**API Endpoint:**
```javascript
// Upload audio and get transcript with word-level timestamps
const response = await fetch('https://api.assemblyai.com/v2/transcript', {
  method: 'POST',
  headers: {
    'Authorization': ASSEMBLYAI_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    audio_url: 'https://your-r2-bucket.com/audio.mp3',
    word_boost: ['specific', 'terms'],  // Optional: improve accuracy
    language_code: 'hi'  // Hindi support!
  })
});
```

**Response format:**
```json
{
  "words": [
    {"text": "Hello", "start": 0, "end": 500, "confidence": 0.99},
    {"text": "world", "start": 510, "end": 900, "confidence": 0.98}
  ]
}
```

### Cloudflare R2 (Storage)
```bash
# Get credentials from: https://dash.cloudflare.com/
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=captioncraft
```

**S3-compatible API:**
```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});
```

---

## 📁 Project Structure

```
captioncraft/
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── upload/route.ts
│   │       └── status/[id]/route.ts
│   ├── components/
│   │   ├── VideoUploader.tsx
│   │   ├── CaptionEditor.tsx
│   │   ├── FontSelector.tsx
│   │   └── StylePreview.tsx
│   ├── lib/
│   │   └── r2.ts
│   └── public/
│       └── fonts/              # Preview fonts (WOFF2)
│
├── backend/                     # Python/Node processing
│   ├── main.py                 # FastAPI server
│   ├── processor.py            # Video processing logic
│   ├── transcriber.py          # AssemblyAI integration
│   ├── subtitles.py            # ASS subtitle generator
│   ├── fonts/                  # TTF fonts for FFmpeg
│   │   ├── Montserrat-Bold.ttf
│   │   ├── Poppins-Bold.ttf
│   │   └── ...
│   └── requirements.txt
│
├── docker-compose.yml          # Local development
├── railway.json                # Railway deployment config
└── README.md
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` (Railway backend URL)
   - `R2_*` credentials

### Backend (Railway)
1. Create Railway project
2. Deploy from GitHub
3. Add environment variables:
   - `ASSEMBLYAI_API_KEY`
   - `R2_*` credentials
4. Railway will auto-install FFmpeg

**railway.json:**
```json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "python main.py",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
COPY fonts/ /fonts/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## 🔄 User Flow

```
1. User uploads video (drag & drop)
   └── Video uploaded to R2 → Get video_id

2. User selects caption style
   └── Choose font, color, position, animation

3. User clicks "Generate Captions"
   └── API call to backend with video_id + style

4. Backend processes:
   a. Download video from R2
   b. Extract audio (FFmpeg)
   c. Transcribe (AssemblyAI) → Get word timestamps
   d. Generate ASS subtitle file with style
   e. Burn captions onto video (FFmpeg)
   f. Upload result to R2
   g. Return result_url

5. User previews result
   └── Video player with captions

6. User downloads final video
   └── Direct download from R2 (free egress!)
```

---

## ⚡ Performance Optimizations

1. **Parallel Processing:** Extract audio while uploading to R2
2. **Streaming Upload:** Use multipart upload for large videos
3. **Caching:** Cache font files in memory
4. **Queue System:** Use Redis/BullMQ for job queue (if scaling)
5. **CDN:** R2 has built-in CDN, no extra config needed

---

## 🔐 Security Considerations

1. **File Validation:** Check video format, size limits (max 100MB)
2. **Signed URLs:** Use presigned URLs for R2 uploads/downloads
3. **Rate Limiting:** Limit requests per IP
4. **Cleanup:** Delete processed files after 24 hours

---

## 📋 Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# R2 Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=captioncraft
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Backend
ASSEMBLYAI_API_KEY=
PORT=8080
```

---

## 📊 MVP Feature List

### Phase 1 (MVP) ✅
- [ ] Video upload (max 100MB)
- [ ] Audio extraction
- [ ] Speech-to-text transcription
- [ ] 4 caption styles (Classic, Highlight, Colorful, Minimal)
- [ ] 5 font options
- [ ] Caption position (top, center, bottom)
- [ ] Download final video

### Phase 2 (Enhancement)
- [ ] Caption editing (fix mistakes)
- [ ] Word-by-word animation (karaoke style)
- [ ] Custom colors
- [ ] Logo/watermark overlay
- [ ] Batch processing

### Phase 3 (Monetization)
- [ ] Free tier: 5 videos/month
- [ ] Pro tier: Unlimited + custom fonts + priority
- [ ] Pricing: ₹199/month or $4.99/month

---

## 🎬 Caption Animation Styles (Future)

```
1. Pop-in: Words appear with scale animation
2. Typewriter: Characters appear one by one
3. Karaoke: Current word highlighted
4. Bounce: Words bounce in
5. Slide: Words slide from side
```

---

## ✅ Ready for Claude Code

This document contains everything needed to build CaptionCraft:

1. **Tech stack** with exact versions
2. **Cost breakdown** per component
3. **API integrations** with code examples
4. **File structure** for the project
5. **Deployment instructions** for Vercel + Railway
6. **FFmpeg commands** for video processing
7. **Caption styles** in ASS format

**Start building with:**
```bash
# Create the project
npx create-next-app@latest captioncraft --typescript --tailwind --app

# Then follow the structure above
```

---

*Document prepared by Sloth 🦥 for Rajesh's CaptionCraft project*
*Last updated: February 8, 2026*

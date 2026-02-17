# CaptionCraft Backend

AI-powered video caption generator with stylish overlays. Built with FastAPI, FFmpeg, and AssemblyAI.

## 🎬 Features

- **AI Transcription**: Word-level timestamps via AssemblyAI
- **4 Caption Styles**: Classic, Highlight, Colorful, Minimal
- **Custom Fonts**: 10 Google Fonts included
- **Video Processing**: FFmpeg-powered caption burning
- **REST API**: Easy integration with any frontend

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- FFmpeg installed (`brew install ffmpeg` on macOS)
- AssemblyAI API key

### Local Development

```bash
# Clone and setup
cd captioncraft/backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Download fonts (one-time)
./scripts/download-fonts.sh

# Run server
python main.py
```

Server runs at `http://localhost:8080`

### Docker

```bash
# Build
docker build -t captioncraft-backend .

# Run
docker run -p 8080:8080 --env-file .env captioncraft-backend
```

## 📡 API Endpoints

### `GET /` - Health check
```bash
curl http://localhost:8080/
```

### `GET /styles` - Available caption styles
```bash
curl http://localhost:8080/styles
```

### `POST /upload` - Upload video
```bash
curl -X POST -F "file=@video.mp4" http://localhost:8080/upload
# Returns: {"video_id": "uuid", "message": "..."}
```

### `POST /process` - Start captioning
```bash
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "your-video-id",
    "style": "highlight",
    "font": "Poppins",
    "position": "bottom",
    "language": "en",
    "words_per_line": 4
  }'
# Returns: {"job_id": "uuid", "message": "..."}
```

### `GET /status/{job_id}` - Check progress
```bash
curl http://localhost:8080/status/{job_id}
# Returns: {"status": "completed", "progress": 100, ...}
```

### `GET /download/{job_id}` - Download result
```bash
curl -O http://localhost:8080/download/{job_id}
```

## 🎨 Caption Styles

| Style | Description |
|-------|-------------|
| `classic` | Bold white with black outline |
| `highlight` | Yellow highlight box (TikTok style) |
| `colorful` | Pink gradient with glow |
| `minimal` | Small and clean |

## 🔤 Fonts

- Montserrat (Bold, Modern)
- Poppins (Rounded, Friendly)
- Inter (Clean, Readable)
- Roboto (Neutral)
- Bebas Neue (Tall, Condensed)
- Oswald (Strong, Narrow)
- Playfair Display (Elegant, Serif)
- Permanent Marker (Handwritten)
- Anton (Heavy, Impact)
- Archivo Black (Ultra Bold)

## 🚢 Deployment (Railway)

1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy!

Railway auto-detects the Dockerfile and installs FFmpeg.

## 📁 Project Structure

```
backend/
├── main.py          # FastAPI server
├── processor.py     # Video processing pipeline
├── transcriber.py   # AssemblyAI integration
├── subtitles.py     # ASS subtitle generation
├── storage.py       # R2 storage client
├── config.py        # Settings management
├── models.py        # Pydantic models
├── fonts/           # TTF font files
├── temp/            # Temporary processing files
├── output/          # Processed videos
├── Dockerfile
├── requirements.txt
└── railway.json
```

## 💡 Processing Pipeline

1. **Upload** → Video saved to temp storage
2. **Extract Audio** → FFmpeg extracts WAV @ 16kHz
3. **Transcribe** → AssemblyAI returns word timestamps
4. **Generate ASS** → Create styled subtitle file
5. **Burn Captions** → FFmpeg overlays subtitles
6. **Download** → Return captioned video

## 🔧 FFmpeg Commands Used

```bash
# Extract audio
ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav

# Burn captions
ffmpeg -i input.mp4 -vf "ass=captions.ass:fontsdir=/fonts" \
  -c:a copy -c:v libx264 -preset fast -crf 23 output.mp4
```

## 📄 License

MIT

# CaptionCraft Setup Guide

> Complete instructions to deploy CaptionCraft on your own infrastructure

---

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed
- [ ] Docker Desktop (for local development)
- [ ] Git installed
- [ ] A Cloudflare account (free)
- [ ] A Railway account ($5/month hobby tier)
- [ ] A Vercel account (free)
- [ ] An AssemblyAI account (free tier: 185 hours)

---

## 🚀 Quick Start (Local Development)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/captioncraft.git
cd captioncraft

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your credentials (see [Service Setup](#-service-setup) below for how to get each key):

```bash
# Required
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=captioncraft
ASSEMBLYAI_API_KEY=your_api_key
```

### 3. Start with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
```

### 4. Or Start Manually

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Service Setup

### 1. Cloudflare R2 Storage

**Create Account & Bucket:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Sign up or log in
3. Navigate to **R2** in the sidebar
4. Click **Create bucket** → Name it `captioncraft`

**Get API Credentials:**

1. In R2, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Set permissions:
   - **Permission:** Object Read & Write
   - **Specify bucket:** `captioncraft`
4. Save the `Access Key ID` and `Secret Access Key`

**Configure CORS:**

1. Go to R2 → `captioncraft` bucket → **Settings**
2. Scroll to **CORS Policy** → **Add CORS policy**
3. Add this configuration:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

**Enable Public Access (Optional):**

1. R2 → `captioncraft` → **Settings** → **Public Access**
2. Enable **Allow Access**
3. Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)

**Get Account ID:**

1. Go to any Cloudflare page → check the URL
2. Format: `https://dash.cloudflare.com/ACCOUNT_ID/...`
3. Or run `wrangler whoami` if using Wrangler CLI

**Your R2 endpoint:** `https://ACCOUNT_ID.r2.cloudflarestorage.com`

---

### 2. AssemblyAI (Speech-to-Text)

1. Go to [AssemblyAI Signup](https://www.assemblyai.com/dashboard/signup)
2. Create an account (no credit card needed)
3. Copy your **API Key** from the dashboard

**Free Tier:** 185 hours of transcription (~11,000 one-minute reels!)

---

### 3. Railway (Backend Hosting)

**Create Project:**

1. Go to [Railway](https://railway.app) and sign up
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `captioncraft` repository
4. Railway will detect the `backend` folder

**Configure:**

1. Go to your service → **Settings** → **Root Directory** → Set to `/backend`
2. Go to **Variables** and add:

```
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=captioncraft
R2_PUBLIC_URL=https://your-bucket.r2.dev
ASSEMBLYAI_API_KEY=xxx
PORT=8080
```

3. Railway will auto-deploy on every push

**Get Your URL:**

After deployment, go to **Settings** → **Domains** → Generate a domain or add custom domain.

Example: `https://captioncraft-backend.up.railway.app`

---

### 4. Vercel (Frontend Hosting)

**Deploy:**

1. Go to [Vercel](https://vercel.com) and sign up
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js

**Environment Variables:**

In Vercel dashboard → Project → **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://captioncraft-backend.up.railway.app
```

**Custom Domain (Optional):**

1. Settings → Domains → Add your domain
2. Update DNS as instructed

---

## 📁 Project Structure

```
captioncraft/
├── .env.example           # Environment template
├── .env                   # Your local config (git-ignored)
├── docker-compose.yml     # Local development
├── SETUP.md              # This file
│
├── backend/
│   ├── Dockerfile        # Production container
│   ├── railway.json      # Railway config
│   ├── requirements.txt  # Python dependencies
│   ├── main.py          # FastAPI server
│   ├── processor.py     # Video processing
│   ├── transcriber.py   # AssemblyAI integration
│   ├── subtitles.py     # Caption generation
│   └── fonts/           # TTF fonts for FFmpeg
│
├── frontend/
│   ├── Dockerfile.dev   # Dev container
│   ├── vercel.json      # Vercel config
│   ├── package.json
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   └── lib/             # Utilities
│
└── scripts/
    └── setup-r2.sh      # R2 bucket setup helper
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Restrict CORS origins to your actual domains
- [ ] Set up rate limiting on the backend
- [ ] Enable Cloudflare protection on R2
- [ ] Use environment variables (never commit secrets)
- [ ] Set `R2_PUBLIC_URL` only if you want direct downloads
- [ ] Review file size limits in backend config

---

## 💰 Cost Breakdown

| Service | Cost | Free Tier |
|---------|------|-----------|
| Cloudflare R2 | $0.015/GB | 10GB/month |
| Railway | $5/month | None (hobby) |
| Vercel | Free | 100GB bandwidth |
| AssemblyAI | $0.15/hour | 185 hours |

**Estimated Monthly Cost:**
- Light use (100 videos): ~$6/month
- Medium use (500 videos): ~$10/month
- Heavy use (1000 videos): ~$15/month

---

## 🐛 Troubleshooting

### "R2 Access Denied"
- Check your Access Key and Secret are correct
- Verify the bucket name matches exactly
- Ensure your API token has Read & Write permissions

### "FFmpeg not found" (Railway)
- The Dockerfile installs FFmpeg automatically
- If using Nixpacks, add `ffmpeg` to `nixpacks.toml`

### "Transcription timeout"
- AssemblyAI processes async - check the polling endpoint
- Long videos (>10min) take longer

### "CORS errors in browser"
- Verify CORS is configured on R2 bucket
- Check the origin matches your frontend URL
- Try with `["*"]` first, then restrict

### "Video upload fails"
- Check `MAX_VIDEO_SIZE_MB` setting
- Verify R2 bucket has space
- Check browser console for specific error

---

## 📞 Support

- **Architecture docs:** See `captioncraft-architecture.md`
- **Issues:** Open a GitHub issue
- **Updates:** Pull latest and redeploy

---

## 🚢 Deployment Checklist

### First Deployment

- [ ] Create Cloudflare R2 bucket
- [ ] Configure CORS on R2
- [ ] Create R2 API token
- [ ] Sign up for AssemblyAI
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Set all environment variables
- [ ] Test video upload and processing
- [ ] Set up custom domain (optional)

### Updates

```bash
# Local testing
docker-compose up --build

# Deploy
git push origin main
# Railway and Vercel auto-deploy from main branch
```

---

*Happy captioning! 🎬*

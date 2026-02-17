# QR Connect - Digital Networking Card

A beautiful, modern web app for creating digital business cards with QR codes. Perfect for conferences, events, and professional networking.

![QR Connect](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css)

## ✨ Features

- 🎨 **Beautiful UI** - Linear.app and Bento.me inspired design
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Mobile First** - Responsive design optimized for mobile
- ⚡ **Fast** - Built with Next.js 14 App Router and ISR
- 🔐 **Secure Auth** - Supabase authentication (Email + Google OAuth)
- 🎯 **QR Codes** - Generate and download professional QR codes
- 🔗 **Multiple Platforms** - Support for 15+ social platforms
- 💾 **vCard Export** - Download contact as vCard file
- 🎭 **Live Preview** - Real-time preview as you edit

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))

### 1. Clone & Install

```bash
cd /Users/sloth/.openclaw/workspace/qr-connect
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   - Copy the contents of `supabase/schema.sql`
   - Paste and execute in Supabase SQL Editor
3. Enable Google OAuth (optional but recommended):
   - Go to **Authentication** → **Providers** → **Google**
   - Follow Supabase's guide to set up Google OAuth
   - Add authorized redirect URL: `http://localhost:3000/auth/callback` (dev) and your production URL

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in: **Supabase Dashboard** → **Settings** → **API**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update Supabase redirect URL to your production domain

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🎯 Supported Platforms

- LinkedIn
- Twitter/X
- Instagram
- GitHub
- YouTube
- Website
- Email
- Phone
- WhatsApp
- Telegram
- Discord
- Medium
- Dribbble
- Behance
- Custom URLs

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **QR Codes**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
qr-connect/
├── app/
│   ├── [username]/          # Public profile pages (SSR)
│   ├── dashboard/           # User dashboard
│   │   └── qr/             # QR fullscreen view
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/             # Reusable components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── PlatformIcon.tsx
├── lib/
│   ├── supabase.ts        # Supabase client & types
│   └── utils.ts           # Utility functions
├── supabase/
│   └── schema.sql         # Database schema
└── public/                # Static assets
```

## 🎨 Design Philosophy

- **Clean & Modern**: Inspired by Linear.app's minimal design
- **Smooth Animations**: Subtle micro-interactions enhance UX
- **Consistent Spacing**: 8px grid system
- **Professional Colors**: Purple/indigo primary with subtle grays
- **Accessibility**: High contrast ratios, semantic HTML

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## 📝 Database Schema

### `profiles` table
- `id` (uuid, FK to auth.users)
- `username` (text, unique, lowercase)
- `display_name` (text)
- `bio` (text, nullable)
- `avatar_url` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `links` table
- `id` (uuid)
- `profile_id` (uuid, FK to profiles)
- `platform` (text)
- `url` (text)
- `label` (text, nullable)
- `sort_order` (integer)
- `created_at` (timestamp)

## 🚫 Limitations (MVP)

This is an MVP. The following features are **not** included:
- Payment/billing
- Analytics dashboard
- Team features
- Custom domains
- Link tracking

These may be added in future versions.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

Built with ❤️ by Team Sloth

Inspired by:
- [Linear.app](https://linear.app) - Design inspiration
- [Bento.me](https://bento.me) - Profile card concept
- [Linktree](https://linktr.ee) - Link aggregation idea

---

**Made with QR Connect** 🚀

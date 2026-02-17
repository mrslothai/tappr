# MEMORY.md — Long-Term Memory

_Last updated: 2026-02-13_

## 🧑 About Rajesh
- Software engineer, 5 years (React, Node, Next.js, Nest.js)
- Building voice agents ("Max") for client as day job
- Instagram: @therajeshchityal — 241 followers, 60 reels (AI Tools & Business Growth)
- **Mission: ₹1M ARR in 2026** — fast iteration, small but quality products
- Timezone: Asia/Calcutta (GMT+5:30)
- Works from home, available most of the time
- Telegram ID: 1151692126
- Secondary user: Prameela (Telegram ID: 8335293259)

## 🎯 Current Priority: QR Connect
- Digital networking card app (all social links + QR code for event networking)
- Rajesh experienced the pain point firsthand at AI Impact Summit
- **Live URL**: https://qr-connect-lake.vercel.app (deployed, needs Supabase for auth/data)
- Stack: Next.js 14 (App Router) + Tailwind + Supabase + qrcode.react
- Code: `/Users/sloth/.openclaw/workspace/qr-connect/`
- Revenue model: Free tier → Pro ₹199/mo → Teams ₹499/user → Event Pass ₹99/event
- Target: 100K free → 5K paid × ₹2,500 ARPU = ₹1.25 Cr ARR
- India-first strategy: UPI QR normalized, WhatsApp integration, undercuts Linktree pricing
- Research report: `/Users/sloth/.openclaw/workspace-researcher/qr-networking-card-research-report.md` (23K words)

### Tappr Status
- ✅ MVP built, deployed, **tappr.in live with SSL**
- ✅ Supabase connected (project `fmacbdrwkitpluetlbzy`)
- ✅ Phase 1 monetization (Free/Pro tiers, pricing page, analytics paywall)
- ✅ WhatsApp share feature (dashboard, profile, welcome page, tracking)
- ✅ Mobile responsive landing page
- ✅ GTM strategy delivered by Strategist agent
- ❌ Avatars storage bucket not created yet (SQL sent to Rajesh)
- ❌ Razorpay integration not yet built
- ❌ Full QA pass not yet done

## 🤖 Team Sloth (Multi-Agent Setup)
- **Sloth (main)**: Team lead, Opus 4.6, delegates & reviews
- **Coder**: Dev specialist, Kimi K2.5, workspace-coder/
- **Creator**: Content specialist, Sonnet 4.5, workspace-creator/
- **Researcher**: Research specialist, Sonnet 4.5, workspace-researcher/
- **Strategist**: Business/growth specialist, Sonnet 4.5, workspace-strategist/
- **Tester**: QA specialist, Sonnet 4.5 (upgraded from Haiku 2026-02-17), workspace-tester/
- Config: `~/.openclaw/openclaw.json` — all 6 agents registered

## 📐 Hard-Learned Lessons
1. **Never trust subagent "0 errors" claims** — Coder reported clean build but it actually failed; always verify independently
2. **Beautiful UI mandatory for MVPs** — SmartPass had ugly UI, Rajesh was furious; quality bar = "VC should think a design team worked on it"
3. **Always test before deploying** — never ship untested code; run Tester validation first
4. **Sloth is team lead, not user's assistant** — manage team, deliver final working products; don't ask user to test or re-define requirements
5. **Sloth should not do testing work** — delegate QA to Tester agent
6. **Lazy Supabase initialization** — `getSupabase()` pattern prevents build crashes when env vars missing
7. **PDF.js worker must be local** — CDN fetch fails in production; import as `?url`

## 📝 Content Rules
- **Reel scripts: ALWAYS Hinglish** (Hindi in Roman/English script, NOT Devanagari)
- English captions for Instagram posts (algorithm optimization)
- Hinglish must match WhatsApp/Instagram typing style (natural, not academic)

## 🛠️ Infrastructure
- **Vercel account**: sloths-projects-e6f3baf0
- **Deployed projects**: smartpass, followpulse, qr-connect
- **OpenClaw version**: v2026.2.13
- **Heartbeat model**: Haiku 4.5 (cheap, good enough for autonomous checks)

## 📦 Other Projects (Paused/Background)
- **CaptionCraft**: Hinglish auto-captions using Sarvam AI — transliteration fixed (9/9 tests passing) but Sarvam API key expired
- **SmartPass**: Boarding pass scanner PWA — paused per user request (parser issues with Indian passes)
- **Wedding invite video business**: Identified as opportunity, not yet started

## 🔑 Missing Keys/Setup
- Sarvam API key: EXPIRED (needs renewal at dashboard.sarvam.ai)
- Brave Search API key: NEEDED for Researcher agent ($5/mo free tier)
- Supabase project: NEEDED for QR Connect

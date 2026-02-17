# 🦥 OpenClaw Setup Guide (Official)

## ⚠️ SECURITY WARNING

> **🚨 THIS BOT CAN ACCESS EVERYTHING ON YOUR LAPTOP**
> 
> OpenClaw gives AI agents full access to:
> - Your files and folders
> - Terminal/Command line
> - Browser
> - Installed applications
> - System settings
> 
> **ONLY install if you understand and accept these risks.**

---

## 📋 Prerequisites

- **Node.js 22 or newer**
- **macOS, Linux, or Windows**
- **Terminal access**

Check Node version:
```bash
node --version
```

---

## 🚀 Quick Setup

### Step 1: Install OpenClaw

```bash
npm install -g openclaw
```

Verify installation:
```bash
openclaw --version
```

---

### Step 2: Start the Gateway

The Gateway is the bridge between your laptop and AI agents.

```bash
openclaw gateway start
```

This starts the gateway on `ws://127.0.0.1:18789`

Check status:
```bash
openclaw gateway status
```

---

### Step 3: Configure Authentication

**Option A: Quick Web Setup (Recommended)**

1. Open the control UI:
   ```bash
   openclaw gateway dashboard
   ```
   Or visit: `http://127.0.0.1:18789/`

2. Follow the web interface to:
   - Set up pairing/approval
   - Configure channels (Telegram, etc.)
   - Set allowed users

**Option B: Manual Config**

Edit config file:
```bash
openclaw config edit
```

Or set values directly:
```bash
openclaw config set telegram.bot_token YOUR_TOKEN
```

---

### Step 4: Pair Your Device

**For Telegram:**

1. Run pairing command:
   ```bash
   openclaw pairing telegram
   ```

2. Scan the QR code or follow the link

3. Approve the pairing in Telegram

**Read more:** [Pairing Documentation](https://docs.openclaw.ai/channels/pairing)

---

## 🔌 Connecting Channels

### Telegram
```bash
openclaw pairing telegram
```

### Chrome Extension (Browser Control)

1. Download OpenClaw Chrome Extension
2. Click extension icon on any tab
3. Toggle ON to attach the tab

**Note:** Extension connects to `ws://127.0.0.1:18789/`

---

## 🛠️ Useful Commands

```bash
# Check gateway status
openclaw gateway status

# View logs
openclaw gateway logs

# Stop gateway
openclaw gateway stop

# Restart gateway
openclaw gateway restart

# Open dashboard
openclaw gateway dashboard

# Edit configuration
openclaw config edit

# View configuration
openclaw config get
```

---

## 🔐 Security Settings

### Set Allowed Users (IMPORTANT)

Limit who can control your laptop:

```bash
openclaw config set security.allowed_users YOUR_TELEGRAM_USER_ID
```

Find your Telegram ID:
- Message @userinfobot
- It will reply with your ID

---

## 🌍 Environment Variables

Customize OpenClaw paths:

```bash
# Set home directory
export OPENCLAW_HOME=/custom/path

# Set state directory
export OPENCLAW_STATE_DIR=/custom/state

# Set config file path
export OPENCLAW_CONFIG_PATH=/custom/config.json
```

---

## ✅ What You Will Have

After setup:
- ✅ A running Gateway
- ✅ Authentication configured
- ✅ Control UI access
- ✅ Connected channel (Telegram)
- ✅ AI agent can now access your laptop

---

## 📚 Next Steps

- **Pairing safety:** [docs.openclaw.ai/channels/pairing](https://docs.openclaw.ai/channels/pairing)
- **More channels:** [docs.openclaw.ai/channels](https://docs.openclaw.ai/channels)
- **Advanced setup:** [docs.openclaw.ai/start/setup](https://docs.openclaw.ai/start/setup)
- **Environment variables:** [docs.openclaw.ai/help/environment](https://docs.openclaw.ai/help/environment)

---

## 🆘 Troubleshooting

**Gateway won't start:**
```bash
# Check if port is in use
lsof -i :18789

# Kill existing process
pkill -f openclaw

# Restart
openclaw gateway start
```

**Extension won't connect:**
- Ensure gateway is running: `openclaw gateway status`
- Check URL: `ws://127.0.0.1:18789/`
- Try restarting Chrome

**Pairing failed:**
- Check your bot token is correct
- Ensure user ID is in allowed_users list
- Try revoking and re-pairing

---

## 🧹 Uninstalling

```bash
# Stop gateway
openclaw gateway stop

# Uninstall
npm uninstall -g openclaw

# Remove config (optional)
rm -rf ~/.openclaw
```

---

## 📖 Official Documentation

- **Getting Started:** https://docs.openclaw.ai/start/getting-started
- **Full Setup:** https://docs.openclaw.ai/start/setup
- **Pairing:** https://docs.openclaw.ai/channels/pairing
- **Environment:** https://docs.openclaw.ai/help/environment

---

**Created for:** Rajesh's AI Assistant (Sloth) 🦥

**Based on:** Official OpenClaw Documentation

**⚠️ Remember: This tool grants AI full access to your system. Use responsibly.**

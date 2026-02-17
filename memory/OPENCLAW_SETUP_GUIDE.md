# 🦥 OpenClaw Setup Guide

## ⚠️ CRITICAL SECURITY WARNING

> **🚨 THIS BOT CAN ACCESS EVERYTHING ON YOUR LAPTOP**
> 
> OpenClaw gives AI agents full access to:
> - Your files and folders
> - Terminal/Command line
> - Browser
> - Installed applications
> - System settings
> 
> **ONLY install if you:**
> - Trust the AI agent completely
> - Understand the security risks
> - Are okay with remote code execution
> - Have backups of important data
> 
> **Never share your OpenClaw session with untrusted parties.**

---

## 📦 Installation

### Step 1: Install OpenClaw

**Via Homebrew (Mac):**
```bash
brew install openclaw
```

**Via NPM:**
```bash
npm install -g openclaw
```

**Verify installation:**
```bash
openclaw --version
```

---

## 🔧 Initial Setup

### Step 2: Start the Gateway

The gateway is the bridge between your laptop and the AI agent.

```bash
openclaw gateway start
```

**Check status:**
```bash
openclaw gateway status
```

**Auto-start on boot (recommended):**
```bash
openclaw gateway enable
```

---

### Step 3: Configure OpenClaw

**Edit config file:**
```bash
openclaw config edit
```

**Or set specific values:**
```bash
# Set your Telegram bot token
openclaw config set telegram.bot_token YOUR_BOT_TOKEN

# Set allowed users (security!)
openclaw config set security.allowed_users YOUR_TELEGRAM_ID
```

---

### Step 4: Connect Telegram

**Option A: Using BotFather**

1. Message @BotFather on Telegram
2. Create new bot: `/newbot`
3. Copy the API token
4. Set it in OpenClaw:
   ```bash
   openclaw config set telegram.bot_token YOUR_TOKEN
   ```

**Option B: Using OpenClaw QR Code**

```bash
openclaw pairing telegram
```

Scan the QR code with Telegram.

---

## 🔐 Security Best Practices

### ✅ DO:
- [ ] Set allowed_users to only your Telegram ID
- [ ] Use a dedicated bot (not your personal account)
- [ ] Keep OpenClaw updated
- [ ] Monitor what commands are being run
- [ ] Use in isolated environment for testing

### ❌ DON'T:
- [ ] Share your OpenClaw session with others
- [ ] Install on work/corporate laptops without permission
- [ ] Run on machines with sensitive data (banking, crypto)
- [ ] Leave gateway running when not in use (if paranoid)
- [ ] Give AI access to delete critical files

---

## 🚀 Connecting Browser (Chrome Extension)

### Step 1: Install Extension

1. Download OpenClaw Chrome Extension
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension folder

### Step 2: Connect to Gateway

1. Click OpenClaw extension icon in Chrome
2. Ensure gateway is running (`openclaw gateway status`)
3. Extension will auto-connect to `ws://127.0.0.1:18789`
4. Toggle ON for each tab you want AI to control

### Troubleshooting:

**If extension shows "disconnected":**
```bash
# Restart gateway
openclaw gateway restart

# Check port
openclaw gateway status
```

---

## 🛠️ Available Tools

Once connected, AI can use:

| Tool | Description | Risk Level |
|------|-------------|------------|
| `exec` | Run terminal commands | 🔴 HIGH |
| `read` | Read any file | 🟡 MEDIUM |
| `write` | Create/overwrite files | 🔴 HIGH |
| `browser` | Control Chrome | 🟡 MEDIUM |
| `message` | Send Telegram messages | 🟢 LOW |
| `web_search` | Search the web | 🟢 LOW |

---

## 📝 Sample Session

**User:** "Sloth, open VS Code"

**What happens:**
1. AI receives message via Telegram
2. AI calls `exec` tool with command: `open -a "Visual Studio Code"`
3. OpenClaw executes on your laptop
4. VS Code opens
5. AI confirms: "VS Code opened!"

---

## 🧹 Uninstalling

```bash
# Stop gateway
openclaw gateway stop

# Disable auto-start
openclaw gateway disable

# Uninstall
brew uninstall openclaw
# or
npm uninstall -g openclaw
```

---

## 🆘 Emergency: Revoke Access

**If you need to immediately cut AI access:**

```bash
# Stop the gateway
openclaw gateway stop

# Or kill the process
pkill -f openclaw
```

**Revoke Telegram bot:**
- Message @BotFather
- Send: `/revoke` 
- Select your bot
- Token becomes invalid immediately

---

## 💡 Pro Tips

1. **Use a dedicated laptop** for OpenClaw if possible
2. **Create snapshots/backups** before major AI operations
3. **Review what AI does** - don't blindly approve
4. **Set file access limits** if possible
5. **Keep logs** to audit AI actions:
   ```bash
   tail -f /tmp/openclaw/openclaw-*.log
   ```

---

## 📚 Resources

- **Docs:** https://docs.openclaw.ai
- **GitHub:** https://github.com/openclaw/openclaw
- **Troubleshooting:** https://docs.openclaw.ai/troubleshooting

---

**Created for:** Rajesh's AI Assistant (Sloth) 🦥

**Last Updated:** February 10, 2025

**⚠️ Remember: With great power comes great responsibility.**

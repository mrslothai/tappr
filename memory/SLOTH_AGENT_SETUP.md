# 🦥 Sloth Agent Setup Guide

Turn your Mac into a Jarvis-like system that I can control via Telegram!

---

## What You Get

- **Live demo capability**: You message me → your laptop executes instantly
- **No editing needed**: Everything happens in real-time on camera
- **Jarvis illusion**: Looks like AI directly controls your computer

---

## Setup Steps (5 minutes)

### Step 1: Create Telegram Bot

1. Open Telegram
2. Search for **@BotFather**
3. Start chat → Type: `/newbot`
4. Name it: `SlothAgent` (or anything)
5. Username: `rajesh_sloth_bot` (must end in _bot, unique)
6. **Copy the API token** (looks like: `123456789:ABCdefGHIjklMNOpqrSTUvwxyz`)

### Step 2: Install Dependencies

Open Terminal and run:

```bash
pip3 install python-telegram-bot pynput requests
```

If you get errors, try:
```bash
pip3 install --upgrade pip
pip3 install python-telegram-bot
```

### Step 3: Configure Sloth Agent

1. Open `sloth-agent.py` in VS Code
2. Find this line:
   ```python
   BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
   ```
3. Replace with your actual token from BotFather
4. Save file

### Step 4: Run Sloth Agent

```bash
cd ~/.openclaw/workspace/memory
python3 sloth-agent.py
```

You should see:
```
🦥 Sloth Agent starting...
Waiting for commands from Telegram...
🦥 Sloth Agent is running!
```

**Keep this terminal window open!**

---

## How It Works

### For the Reel:

1. **Start recording** (camera + screen)
2. **You fixing lamp**
3. **Pick up phone** → Send me voice: "Sloth mere liye portfolio banao"
4. **I reply** in Telegram with command
5. **Your laptop instantly responds**:
   - Notification: "🦥 Sloth taking control..."
   - VS Code opens
   - Files create
   - Browser launches
6. **Reaction shot**: Your surprised face
7. **CTA**: "Comment 'Sloth' for setup guide"

### Commands I Can Send:

| Command | What Happens |
|---------|--------------|
| `/demo` | Full portfolio demo (VS Code + Browser) |
| `/open Safari` | Opens Safari |
| `/open "Visual Studio Code"` | Opens VS Code |
| `/say "Hello Rajesh"` | Mac speaks |
| `/notify "Task complete"` | Shows notification |
| `/cmd ls -la` | Runs terminal command |
| "portfolio" (text) | Triggers demo automatically |
| "open code" (text) | Opens VS Code |

---

## Testing Before Reel

**Test 1: Basic connection**
1. Run `python3 sloth-agent.py`
2. Message your bot: `/start`
3. Should reply: "🦥 Sloth Agent activated!"

**Test 2: Demo command**
1. Message: `/demo`
2. Should:
   - Show notification
   - Create ~/Desktop/sloth-portfolio/
   - Open VS Code
   - Open browser

**Test 3: Voice trigger**
1. Send voice message: "portfolio"
2. Should trigger demo automatically

---

## For the Reel Script

### Your Dialogue (Hinglish):

**Shot 1:**
"Dekh raha hai? Main software engineer hoon... aur yeh lamp fix kar raha hoon."

***(look at camera)***

"Kyunki coding ab Sloth karta hai."

**Shot 2:**
***(pick up phone, voice message)***

"Sloth mere liye portfolio website banao"

**Shot 3:**
***(notification pops on laptop)***

**Notification:** "🦥 Sloth is taking control..."

***(VS Code opens automatically)***

"Dekho! Laptop khud kaam kar raha hai!"

**Shot 4:**
***(browser opens, website loads)***

"45 second mein! Poora website!"

**Shot 5:**
"Chahe portfolio ho, automation ho, ya koi bhi code..."

"Comment karo 'Sloth' - aap bhi apna AI assistant setup karo!"

---

## Troubleshooting

### "pip3 not found"
```bash
brew install python3
```

### "Permission denied"
```bash
chmod +x sloth-agent.py
```

### Bot not responding
1. Check token is correct
2. Make sure you're messaging YOUR bot (not me directly)
3. Check terminal for errors

### VS Code doesn't open
```bash
# Run this once to register VS Code command
ln -s "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" /usr/local/bin/code
```

---

## Pro Tips

1. **Keep terminal visible** during demo (looks cool)
2. **Use Do Not Disturb** (no random notifications)
3. **Clean desktop** (move files to folder)
4. **Dark mode** everything (looks better)
5. **Test 3 times** before shooting

---

## After the Reel

This setup is actually useful! You can:
- Remotely open apps from phone
- Run commands while away from laptop
- Show off to friends 😎

---

## Files Location

- Agent script: `~/.openclaw/workspace/memory/sloth-agent.py`
- Demo HTML: `~/.openclaw/workspace/memory/sloth-demo.sh`
- This guide: `~/.openclaw/workspace/memory/SLOTH_AGENT_SETUP.md`

---

Ready to become Iron Man? 🦥🚀

**Next step:** Create the bot with BotFather, then test!

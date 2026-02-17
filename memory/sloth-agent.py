#!/usr/bin/env python3
"""
🦥 Sloth Agent - Remote Control via Telegram
Install: pip install python-telegram-bot pynput requests
Run: python3 sloth-agent.py
"""

import asyncio
import subprocess
import os
import json
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# CONFIG - Get these from BotFather
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"  # We'll get this from BotFather
AUTHORIZED_USER_ID = None  # Your Telegram user ID (I'll help you get this)

print("🦥 Sloth Agent starting...")
print("Waiting for commands from Telegram...")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    await update.message.reply_text(
        "🦥 Sloth Agent activated!\n\n"
        "I can now control this laptop remotely.\n"
        "Send me commands and I'll execute them instantly!"
    )


async def demo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Run the portfolio demo"""
    await update.message.reply_text("🦥 Executing portfolio demo...")
    
    # Show notification on Mac
    subprocess.run([
        "osascript", "-e", 
        'display notification "Sloth is taking control..." with title "🦥 Sloth Agent"'
    ])
    
    # Execute the demo
    try:
        # Create directory
        demo_dir = os.path.expanduser("~/Desktop/sloth-portfolio")
        os.makedirs(demo_dir, exist_ok=True)
        
        # Create HTML file
        html_content = '''<!DOCTYPE html>
<html>
<head>
    <title>Rajesh Chityal | Software Engineer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        h1 { font-size: 3.5rem; margin-bottom: 20px; animation: fadeIn 1s; }
        .highlight { 
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p { font-size: 1.3rem; max-width: 600px; margin-bottom: 30px; opacity: 0.9; }
        .btn {
            padding: 15px 40px;
            background: white;
            color: #764ba2;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: transform 0.3s;
        }
        .btn:hover { transform: translateY(-3px); }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <h1>Hi, I'm <span class='highlight'>Rajesh Chityal</span></h1>
    <p>Software Engineer with 5+ years experience. Building scalable web apps, AI tools, and Instagram content. React • Node.js • Voice AI</p>
    <a href='#' class='btn'>Get In Touch</a>
</body>
</html>'''
        
        with open(f"{demo_dir}/index.html", "w") as f:
            f.write(html_content)
        
        # Open VS Code
        subprocess.run(["open", "-a", "Visual Studio Code", demo_dir])
        await asyncio.sleep(2)
        
        # Open browser
        subprocess.run(["open", f"{demo_dir}/index.html"])
        
        await update.message.reply_text(
            "✅ Portfolio created!\n"
            "📁 Location: ~/Desktop/sloth-portfolio\n"
            "🌐 Opened in browser"
        )
        
        # Success notification
        subprocess.run([
            "osascript", "-e",
            'display notification "Portfolio ready!" with title "🦥 Sloth Agent" sound name "Glass"'
        ])
        
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")


async def execute_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Execute a terminal command"""
    command = ' '.join(context.args)
    
    if not command:
        await update.message.reply_text("Usage: /cmd <command>")
        return
    
    await update.message.reply_text(f"🦥 Executing: {command}")
    
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True,
            timeout=30
        )
        
        output = result.stdout if result.stdout else "Command executed successfully"
        if result.stderr:
            output += f"\nErrors: {result.stderr}"
        
        # Truncate if too long
        if len(output) > 4000:
            output = output[:4000] + "..."
        
        await update.message.reply_text(f"```\n{output}\n```", parse_mode="Markdown")
        
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")


async def open_app(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Open a Mac application"""
    app_name = ' '.join(context.args)
    
    if not app_name:
        await update.message.reply_text("Usage: /open <app_name>\nExample: /open Safari")
        return
    
    try:
        subprocess.run(["open", "-a", app_name])
        await update.message.reply_text(f"🦥 Opened {app_name}")
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")


async def say(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Make Mac speak"""
    text = ' '.join(context.args)
    
    if not text:
        await update.message.reply_text("Usage: /say <message>")
        return
    
    subprocess.run(["say", text])
    await update.message.reply_text(f"🗣️ Said: {text}")


async def notify(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show Mac notification"""
    text = ' '.join(context.args) or "🦥 Sloth Agent"
    
    subprocess.run([
        "osascript", "-e",
        f'display notification "{text}" with title "🦥 Sloth Agent"'
    ])
    await update.message.reply_text("📢 Notification sent!")


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle regular text messages"""
    text = update.message.text.lower()
    
    # Check for specific keywords
    if "portfolio" in text or "website" in text:
        await demo(update, context)
    elif "open code" in text or "vs code" in text:
        subprocess.run(["open", "-a", "Visual Studio Code"])
        await update.message.reply_text("🦥 Opened VS Code")
    elif "open browser" in text or "safari" in text:
        subprocess.run(["open", "-a", "Safari"])
        await update.message.reply_text("🦥 Opened Safari")
    else:
        await update.message.reply_text(
            "🦥 I heard you! Available commands:\n"
            "/demo - Create portfolio\n"
            "/open <app> - Open app\n"
            "/say <text> - Make Mac speak\n"
            "/cmd <command> - Run terminal command"
        )


def main():
    """Start the bot"""
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("demo", demo))
    application.add_handler(CommandHandler("cmd", execute_command))
    application.add_handler(CommandHandler("open", open_app))
    application.add_handler(CommandHandler("say", say))
    application.add_handler(CommandHandler("notify", notify))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    
    print("🦥 Sloth Agent is running!")
    print("Send commands from Telegram to control this laptop")
    print("Press Ctrl+C to stop")
    print("-" * 50)
    
    # Run the bot
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()

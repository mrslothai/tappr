#!/bin/bash
# 🦥 Sloth Agent - Dramatic Reel Demo
# Creates "Rajesh says hi" page with Instagram switching

echo "🦥 Sloth Agent activated..."
sleep 1

# Create project folder
mkdir -p ~/Desktop/sloth-demo
cd ~/Desktop/sloth-demo

echo "🎯 Opening VS Code..."
open -a "Visual Studio Code" ~/Desktop/sloth-demo
sleep 3

echo "📝 Creating page..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Rajesh Says Hi</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            animation: bgShift 10s ease infinite;
        }
        @keyframes bgShift {
            0%, 100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            50% { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        }
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 4px solid white;
            margin-bottom: 30px;
            object-fit: cover;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-align: center;
        }
        .highlight {
            color: #f093fb;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <!-- Placeholder for Rajesh's image -->
    <div class="profile-img" style="background: #fff; display: flex; align-items: center; justify-content: center; color: #764ba2; font-size: 4rem;">
        👤
    </div>
    <h1><span class="highlight">Rajesh</span> says hi 👋</h1>
    <p>Built by Sloth in 30 seconds 🦥</p>
</body>
</html>
EOF

sleep 2

echo "📱 Opening Instagram..."
open -a "Google Chrome" "https://www.instagram.com/therajeshchityal"
sleep 3

echo "🔄 Switching between apps..."

# Switch 1: Chrome -> VS Code
sleep 2
osascript -e 'tell application "Visual Studio Code" to activate'
sleep 2

# Switch 2: VS Code -> Chrome
osascript -e 'tell application "Google Chrome" to activate'
sleep 2

# Switch 3: Chrome -> VS Code
osascript -e 'tell application "Visual Studio Code" to activate'
sleep 2

# Final: Show the page
echo "🎉 Showing final page..."
open ~/Desktop/sloth-demo/index.html
sleep 1
osascript -e 'display notification "Rajesh says hi! 👋" with title "🦥 Sloth Agent" sound name "Hero"'

echo "✅ Demo complete!"
echo "🦥 Sloth out!"

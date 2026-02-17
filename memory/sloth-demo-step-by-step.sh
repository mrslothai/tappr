#!/bin/bash
# 🦥 Sloth Agent - Step by Step Demo for Reel
# This script runs each step with visible delays for recording

echo "🦥 Sloth Agent activated..."
echo "Starting step-by-step portfolio creation..."
sleep 2

# Step 1: Create folder
echo "📁 Step 1: Creating project folder..."
mkdir -p ~/Desktop/sloth-portfolio-demo
sleep 2

# Step 2: Open VS Code (empty)
echo "🎯 Step 2: Opening VS Code..."
open -a "Visual Studio Code" ~/Desktop/sloth-portfolio-demo
sleep 4

# Step 3: Create the HTML file (this will appear in VS Code)
echo "📝 Step 3: Creating index.html..."
sleep 2

cat > ~/Desktop/sloth-portfolio-demo/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        h1 { font-size: 3.5rem; margin-bottom: 20px; }
        .highlight { 
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p { font-size: 1.3rem; max-width: 600px; margin-bottom: 30px; }
        .btn {
            padding: 15px 40px;
            background: white;
            color: #764ba2;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
        }
        .skills {
            margin-top: 40px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .skill-tag {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <h1>Hi, I'm <span class="highlight">Rajesh Chityal</span></h1>
    <p>Software Engineer with 5+ years experience. Building scalable web apps and AI tools.</p>
    <a href="#" class="btn">Get In Touch</a>
    <div class="skills">
        <div class="skill-tag">⚛️ React</div>
        <div class="skill-tag">🚀 Node.js</div>
        <div class="skill-tag">🤖 AI/Voice</div>
    </div>
</body>
</html>
EOF

echo "✅ File created successfully!"
sleep 2

# Step 4: Open browser
echo "🌐 Step 4: Opening browser..."
sleep 1
open ~/Desktop/sloth-portfolio-demo/index.html
sleep 2

echo ""
echo "🎉 Portfolio ready!"
echo "🦥 Sloth out!"

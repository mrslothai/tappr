#!/bin/bash
# 🦥 Sloth Agent Demo Script
# Simulates autonomous AI control of your laptop
# Run: ./sloth-demo.sh

echo "🦥 Sloth Agent activated..."
echo "Taking control of your laptop..."
sleep 1

# Create directory
DEMO_DIR="$HOME/Desktop/sloth-portfolio-demo"
mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

echo "📁 Creating project folder..."
sleep 0.5

# Create the portfolio HTML file
echo "📝 Generating portfolio code..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rajesh Chityal | Software Engineer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: #fff;
            line-height: 1.6;
        }
        .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            animation: fadeInUp 1s ease;
        }
        .hero .highlight {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: 1.3rem;
            max-width: 600px;
            margin-bottom: 40px;
            opacity: 0.9;
            animation: fadeInUp 1s ease 0.2s backwards;
        }
        .btn {
            padding: 15px 40px;
            background: #fff;
            color: #764ba2;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s;
            animation: fadeInUp 1s ease 0.4s backwards;
        }
        .btn:hover { transform: translateY(-3px); }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .features {
            padding: 80px 20px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .features h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 40px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        .feature {
            background: rgba(255,255,255,0.05);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .feature h3 {
            margin-bottom: 10px;
            color: #667eea;
        }
        footer {
            text-align: center;
            padding: 40px;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: #888;
        }
    </style>
</head>
<body>
    <section class="hero">
        <h1>Hi, I'm <span class="highlight">Rajesh Chityal</span></h1>
        <p>Software Engineer with 5+ years experience. Building scalable web apps, AI tools, and Instagram content. React • Node.js • Voice AI</p>
        <a href="#contact" class="btn">Get In Touch</a>
    </section>
    
    <section class="features">
        <h2>What I Do</h2>
        <div class="feature-grid">
            <div class="feature">
                <h3>⚛️ Frontend</h3>
                <p>React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div class="feature">
                <h3>🚀 Backend</h3>
                <p>Node.js, Nest.js, PostgreSQL, APIs</p>
            </div>
            <div class="feature">
                <h3>🤖 AI & Voice</h3>
                <p>Voice Agents, AI Integration, Automation</p>
            </div>
            <div class="feature">
                <h3>📱 Content</h3>
                <p>Instagram Reels, AI Tools, Business Growth</p>
            </div>
        </div>
    </section>
    
    <footer>
        <p>Built by Rajesh with 💜 | Powered by Sloth 🦥</p>
        <p>1M ARR Journey 2026</p>
    </footer>
</body>
</html>
EOF

echo "✅ Portfolio code generated!"
sleep 0.5

# Open VS Code
echo "🎯 Opening VS Code..."
open -a "Visual Studio Code" "$DEMO_DIR"
sleep 2

# Open in browser
echo "🌐 Launching browser..."
open "$DEMO_DIR/index.html"
sleep 2

echo ""
echo "🦥 Demo ready!"
echo "Folder: $DEMO_DIR"
echo ""
echo "Next step for deploy:"
echo "  cd $DEMO_DIR"
echo "  npx surge"
echo ""

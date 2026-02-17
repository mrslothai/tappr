-- 🦥 Sloth Agent - Autonomous Demo
-- AppleScript for realistic "AI controlling laptop" effect
-- Run: osascript sloth-demo.scpt

-- Open Terminal and type commands
 tell application "Terminal"
    activate
    delay 0.5
    
    -- Type mkdir command character by character
    do script "echo '🦥 Sloth Agent activated...'"
    delay 1
    
    do script "mkdir -p ~/Desktop/sloth-portfolio && cd ~/Desktop/sloth-portfolio"
    delay 0.5
    
    do script "echo '📝 Creating portfolio...'"
    delay 0.3
end tell

-- Open VS Code with the folder
tell application "Visual Studio Code"
    activate
    delay 1
end tell

tell application "Terminal"
    do script "code ~/Desktop/sloth-portfolio"
    delay 2
end tell

-- Create the HTML file
tell application "Terminal"
    do script "cat > ~/Desktop/sloth-portfolio/index.html << 'EOF'
<!DOCTYPE html>
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
        h1 { font-size: 3rem; margin-bottom: 20px; }
        .highlight { color: #f093fb; }
        p { font-size: 1.2rem; max-width: 600px; margin-bottom: 30px; }
        .btn {
            padding: 15px 40px;
            background: white;
            color: #764ba2;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Hi, I'm <span class='highlight'>Rajesh Chityal</span></h1>
    <p>Software Engineer with 5+ years experience. Building scalable web apps, AI tools, and Instagram content.</p>
    <a href='#' class='btn'>Get In Touch</a>
</body>
</html>
EOF"
    delay 1
end tell

-- Open the file in browser
tell application "Safari"
    activate
    delay 0.5
    set URL of front document to "file:///Users/$USER/Desktop/sloth-portfolio/index.html"
end tell

tell application "Terminal"
    do script "echo '✅ Portfolio ready!'"
    delay 0.5
    do script "echo '🦥 Sloth out!'"
end tell

-- Show notification
display notification "Portfolio created successfully!" with title "🦥 Sloth Agent" sound name "Glass"

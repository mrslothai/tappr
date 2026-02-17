-- 🦥 Sloth Agent - Visual Step-by-Step Demo
-- Run: osascript sloth-demo-visual.scpt

-- Show notification first
display notification "Sloth is taking control..." with title "🦥 Sloth Agent" sound name "Glass"

delay 2

-- Step 1: Create folder
do shell script "mkdir -p ~/Desktop/sloth-portfolio-demo"

-- Step 2: Open VS Code (empty folder)
tell application "Visual Studio Code"
    activate
    do shell script "open -a 'Visual Studio Code' ~/Desktop/sloth-portfolio-demo"
end tell

delay 4

-- Step 3: Show "creating file" notification
display notification "Creating portfolio code..." with title "🦥 Sloth Agent"

-- Create the HTML file with all the content
set htmlContent to "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
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
        }
        .skill-tag {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <h1>Hi, I'm <span class='highlight'>Rajesh Chityal</span></h1>
    <p>Software Engineer with 5+ years experience.</p>
    <a href='#' class='btn'>Get In Touch</a>
    <div class='skills'>
        <div class='skill-tag'>⚛️ React</div>
        <div class='skill-tag'>🚀 Node.js</div>
        <div class='skill-tag'>🤖 AI</div>
    </div>
</body>
</html>"

-- Write file
try
    set filePath to (path to desktop as string) & "sloth-portfolio-demo:index.html"
    set fileRef to open for access file filePath with write permission
    set eof of fileRef to 0
    write htmlContent to fileRef
    close access fileRef
on error
    close access (path to desktop as string) & "sloth-portfolio-demo:index.html"
end try

delay 3

-- Step 4: Open browser
display notification "Launching browser..." with title "🦥 Sloth Agent"

do shell script "open ~/Desktop/sloth-portfolio-demo/index.html"

delay 2

-- Success notification
display notification "Portfolio ready!" with title "🦥 Sloth Agent" sound name "Hero"

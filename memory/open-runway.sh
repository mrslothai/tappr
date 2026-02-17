#!/bin/bash
# 🎬 Runway ML Automation Helper
# This script opens Runway and prepares your workflow

echo "🎬 Opening Runway ML..."
echo ""
echo "Follow these steps:"
echo ""
echo "1. Login to your Runway account"
echo "2. Click 'Image to Video'"
echo "3. Upload your couple photo"
echo "4. Use Motion Brush (paint on faces)"
echo "5. Set motion to 3-5"
echo "6. Export as MP4"
echo ""

# Open Runway
open "https://runwayml.com/login"

# Also open sample photos folder
mkdir -p ~/Desktop/wedding-project
open ~/Desktop/wedding-project

echo "✅ Ready! Upload your photos to Runway"
echo "📁 Project folder: ~/Desktop/wedding-project"

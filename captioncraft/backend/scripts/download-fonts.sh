#!/bin/bash
# Download Google Fonts for CaptionCraft
# Run this once before deploying

set -e

FONTS_DIR="${1:-../fonts}"
mkdir -p "$FONTS_DIR"
cd "$FONTS_DIR"

echo "📥 Downloading fonts to $FONTS_DIR..."

# Montserrat Bold
echo "  → Montserrat"
curl -sL "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-Bold.ttf" -o "Montserrat-Bold.ttf"

# Poppins Bold
echo "  → Poppins"
curl -sL "https://github.com/itfoundry/Poppins/raw/master/products/Poppins-Bold.ttf" -o "Poppins-Bold.ttf"

# Inter Bold
echo "  → Inter"
curl -sL "https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf" -o "Inter-Bold.ttf"

# Roboto Regular
echo "  → Roboto"
curl -sL "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Regular.ttf" -o "Roboto-Regular.ttf"

# Bebas Neue
echo "  → Bebas Neue"
curl -sL "https://github.com/dharmatype/Bebas-Neue/raw/master/fonts/BebasNeue-Regular.ttf" -o "BebasNeue-Regular.ttf"

# Oswald Bold
echo "  → Oswald"
curl -sL "https://github.com/googlefonts/OswaldFont/raw/main/fonts/ttf/Oswald-Bold.ttf" -o "Oswald-Bold.ttf"

echo "✅ Fonts downloaded!"
ls -la

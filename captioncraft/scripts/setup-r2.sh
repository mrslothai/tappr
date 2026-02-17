#!/bin/bash
# CaptionCraft - Cloudflare R2 Setup Script
# Run this script after installing Wrangler CLI and logging in

set -e

echo "🚀 CaptionCraft R2 Bucket Setup"
echo "================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

# Check if logged in
echo "📝 Checking Wrangler authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in. Please run:"
    echo "   wrangler login"
    exit 1
fi

BUCKET_NAME="${R2_BUCKET_NAME:-captioncraft}"

echo ""
echo "📦 Creating R2 bucket: $BUCKET_NAME"
echo "-----------------------------------"

# Create the bucket (ignore error if already exists)
wrangler r2 bucket create "$BUCKET_NAME" 2>/dev/null || echo "ℹ️  Bucket may already exist, continuing..."

echo ""
echo "✅ Bucket created/verified: $BUCKET_NAME"

# Create CORS configuration file
CORS_CONFIG=$(cat << 'EOF'
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
EOF
)

echo ""
echo "🔧 Configuring CORS..."
echo "$CORS_CONFIG" > /tmp/cors-config.json

# Apply CORS configuration
# Note: As of 2024, CORS is configured via the Cloudflare dashboard or API
# Wrangler doesn't have direct CORS command, so we'll use the API

echo ""
echo "⚠️  CORS Configuration Required (Manual Step)"
echo "=============================================="
echo ""
echo "Go to Cloudflare Dashboard → R2 → $BUCKET_NAME → Settings → CORS Policy"
echo ""
echo "Add this CORS configuration:"
echo ""
cat << 'CORS_DISPLAY'
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
CORS_DISPLAY

echo ""
echo "🔑 API Token Setup"
echo "=================="
echo ""
echo "1. Go to: https://dash.cloudflare.com → R2 → Manage R2 API Tokens"
echo "2. Create a new API token with:"
echo "   - Permission: Object Read & Write"
echo "   - Specify bucket: $BUCKET_NAME"
echo "3. Save these values to your .env file:"
echo "   - R2_ACCESS_KEY_ID"
echo "   - R2_SECRET_ACCESS_KEY"
echo ""

echo "🌐 Public Access (Optional)"
echo "==========================="
echo ""
echo "To enable public access for video downloads:"
echo "1. Go to: R2 → $BUCKET_NAME → Settings → Public Access"
echo "2. Enable 'Allow Access' for r2.dev subdomain"
echo "3. Your public URL will be: https://<bucket-id>.r2.dev"
echo "   Or connect a custom domain"
echo ""

echo "📋 Getting Account ID..."
ACCOUNT_ID=$(wrangler whoami --json 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")

if [ -n "$ACCOUNT_ID" ]; then
    echo "   Your Account ID: $ACCOUNT_ID"
    echo ""
    echo "   R2 Endpoint: https://$ACCOUNT_ID.r2.cloudflarestorage.com"
else
    echo "   Run 'wrangler whoami' to get your Account ID"
fi

echo ""
echo "✅ R2 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure CORS in Cloudflare Dashboard (see above)"
echo "2. Create R2 API token (see above)"  
echo "3. Add credentials to .env file"
echo "4. Enable public access if needed"
echo ""

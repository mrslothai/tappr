# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, done!
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. Add to `vite.config.js`:
```javascript
export default defineConfig({
  base: '/smartpass/',
  plugins: [react()],
})
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

### Option 4: Cloudflare Pages

1. Push to GitHub
2. Connect repository at pages.cloudflare.com
3. Build command: `npm run build`
4. Output directory: `dist`

## Environment Configuration

No environment variables needed for MVP! Everything runs client-side.

## PWA Requirements for Production

### 1. Create Proper Icons

You need to create these icons:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

Quick way using ImageMagick:
```bash
# Create from SVG
convert -background "#2563eb" -fill white -font Arial-Bold \
  -pointsize 350 -size 512x512 -gravity center \
  label:"✈️" public/icon-512.png

convert public/icon-512.png -resize 192x192 public/icon-192.png
```

Or use an online tool:
- https://realfavicongenerator.net/
- https://favicon.io/

### 2. HTTPS Required

PWAs require HTTPS. All deployment platforms above provide this automatically.

### 3. Service Worker Considerations

- Service worker only works on `localhost` or HTTPS
- Update `CACHE_NAME` in `public/sw.js` when deploying updates
- Users may need to hard refresh to get updates

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] HTTPS is enabled
- [ ] Manifest.json is accessible
- [ ] Service worker registers successfully
- [ ] PWA install prompt appears (mobile/Chrome)
- [ ] Notifications work (after enabling)
- [ ] Offline mode works (after first load)
- [ ] Images upload and process correctly
- [ ] localStorage persists across sessions

## Testing Your Deployment

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Aim for 90+ score

### PWA Checklist
- ✅ Served over HTTPS
- ✅ Has a web app manifest
- ✅ Registers a service worker
- ✅ Is installable
- ✅ Works offline

### Manual Tests
1. Install as PWA
2. Try offline mode
3. Upload a boarding pass
4. Enable notifications
5. Delete a pass
6. Refresh page (data should persist)

## Monitoring

Since this is client-side only, no server monitoring needed.

Optional: Add analytics
```javascript
// In src/main.jsx
if (import.meta.env.PROD) {
  // Add Google Analytics or Plausible
}
```

## Updating the App

```bash
# 1. Update version in public/sw.js
# Change CACHE_NAME to 'smartpass-v2'

# 2. Build
npm run build

# 3. Deploy
vercel --prod  # or your deployment command

# 4. Users will get update on next visit
```

## Performance Optimization

Current bundle size: ~245KB (before gzip)
After gzip: ~79KB

To optimize further:
```bash
# Analyze bundle
npm run build -- --mode analyze

# Consider code splitting if needed
```

## Troubleshooting

### Service Worker Not Updating
```javascript
// Add to src/main.jsx
navigator.serviceWorker.register('/sw.js').then(reg => {
  reg.update();  // Force update check
});
```

### CORS Issues with Images
If users upload from URLs, add to `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api/images': {
      target: 'https://external-image-host.com',
      changeOrigin: true,
    }
  }
}
```

### Large Bundle Size
- Tesseract.js is large (~2MB)
- Consider lazy loading OCR worker
- Or use cloud OCR API for production

## Cost Estimate

**FREE** for MVP! 🎉

All recommended platforms have free tiers:
- Vercel: Free for personal projects
- Netlify: 100GB bandwidth/month
- Cloudflare Pages: Unlimited requests
- GitHub Pages: Free for public repos

## Security Notes

- No backend = No server vulnerabilities
- All data stays client-side
- No API keys needed (Tesseract runs locally)
- No user authentication required
- HTTPS protects data in transit

## Future Scaling

If app becomes popular:
1. Consider CDN for Tesseract.js workers
2. Add optional cloud sync with auth
3. Implement cloud OCR API (Google Vision) for better accuracy
4. Add analytics to understand usage
5. Consider premium features

## Support

For issues, check:
1. Browser console for errors
2. DevTools > Application > Service Workers
3. DevTools > Application > Manifest
4. Network tab for failed requests

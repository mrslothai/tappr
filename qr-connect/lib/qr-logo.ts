// Tappr logo as inline SVG data URI for embedding in QR codes
export const TAPPR_QR_LOGO = `data:image/svg+xml,${encodeURIComponent(`<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#8B5CF6"/><stop offset="50%" stop-color="#A855F7"/><stop offset="100%" stop-color="#EC4899"/></linearGradient></defs><rect x="2" y="2" width="60" height="60" rx="16" fill="url(#g)"/><rect x="2" y="2" width="60" height="60" rx="16" fill="white" fill-opacity="0.1"/><path d="M20 18H44M32 18V46" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="46" r="4" fill="white"/></svg>`)}`

export const qrImageSettings = (size: number) => ({
  src: TAPPR_QR_LOGO,
  x: undefined,
  y: undefined,
  height: Math.round(size * 0.18),
  width: Math.round(size * 0.18),
  excavate: true,
})

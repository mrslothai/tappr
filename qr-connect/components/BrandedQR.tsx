'use client'

import { useRef, useCallback } from 'react'
import { QRCode } from 'react-qrcode-logo'

interface BrandedQRProps {
  value: string
  size?: number
  id?: string
  className?: string
}

export default function BrandedQR({ value, size = 256, id, className }: BrandedQRProps) {
  const qrRef = useRef<QRCode>(null)

  return (
    <div className={className} id={id} style={{ maxWidth: '100%', width: size }}>
      <QRCode
        ref={qrRef}
        value={value}
        size={size}
        bgColor="transparent"
        fgColor="#8b5cf6"
        qrStyle="dots"
        eyeRadius={[
          { outer: [10, 10, 10, 10], inner: [5, 5, 5, 5] },
          { outer: [10, 10, 10, 10], inner: [5, 5, 5, 5] },
          { outer: [10, 10, 10, 10], inner: [5, 5, 5, 5] },
        ]}
        eyeColor="#7c3aed"
        logoImage="/tappr-logo.png"
        logoWidth={size * 0.22}
        logoHeight={size * 0.22}
        logoPadding={6}
        logoPaddingStyle="circle"
        removeQrCodeBehindLogo
        ecLevel="H"
        quietZone={10}
      />
      <style jsx>{`
        div :global(canvas) {
          max-width: 100%;
          height: auto !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  )
}

export function downloadQR(canvasParentId: string, filename: string) {
  const parent = document.getElementById(canvasParentId)
  const canvas = parent?.querySelector('canvas') as HTMLCanvasElement | null
  if (!canvas) return

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.png`
  a.click()
}

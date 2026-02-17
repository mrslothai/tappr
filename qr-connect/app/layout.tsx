import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tappr — Your Network, One Tap Away',
  description: 'Create your digital business card with QR code. Share all your links instantly at conferences, events, and meetings.',
  keywords: ['networking', 'QR code', 'business card', 'digital card', 'tappr', 'linktree alternative'],
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} overflow-x-hidden w-screen max-w-full`}>{children}</body>
    </html>
  )
}

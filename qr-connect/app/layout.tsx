import type { Metadata } from 'next'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

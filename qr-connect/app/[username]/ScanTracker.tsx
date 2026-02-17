'use client'

import { useEffect } from 'react'

interface ScanTrackerProps {
  profileId: string
}

export default function ScanTracker({ profileId }: ScanTrackerProps) {
  useEffect(() => {
    const trackScan = async () => {
      try {
        await fetch('/api/track-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile_id: profileId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          }),
        })
      } catch (error) {
        console.error('Failed to track scan:', error)
      }
    }

    trackScan()
  }, [profileId])

  return null
}

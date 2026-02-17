'use client'

import { useState } from 'react'
import { Share2, X, Copy, Check } from 'lucide-react'
import { trackShare } from '@/lib/utils'

interface ShareButtonProps {
  profileId: string
  displayName: string
  username: string
}

export default function ShareButton({ profileId, displayName, username }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://tappr.in'}/${username}`

  const whatsappMessage = `Hey! Connect with ${displayName} on Tappr 👋\n\n${profileUrl}`

  const handleWhatsAppShare = async () => {
    await trackShare(profileId, 'whatsapp')
    const encodedMessage = encodeURIComponent(whatsappMessage)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
    setShowModal(false)
  }

  const handleCopyLink = async () => {
    await trackShare(profileId, 'copy')
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowModal(false)
    }, 1500)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await trackShare(profileId, 'native')
        await navigator.share({
          title: `${displayName} - Tappr`,
          text: `Connect with ${displayName} on Tappr`,
          url: profileUrl,
        })
        setShowModal(false)
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled', err)
      }
    }
  }

  const hasNativeShare = typeof window !== 'undefined' && navigator.share

  return (
    <>
      {/* Floating Share Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Share profile"
      >
        <Share2 className="w-6 h-6" />
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div
            className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Share Profile
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Share Options */}
            <div className="p-6 space-y-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-4 p-4 bg-[#25D366] hover:bg-[#1eab52] text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span className="font-medium">Share on WhatsApp</span>
              </button>

              {/* Native Share (if available) */}
              {hasNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-all duration-200"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="font-medium">Share...</span>
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-6 h-6 text-green-500" />
                    <span className="font-medium text-green-500">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6" />
                    <span className="font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

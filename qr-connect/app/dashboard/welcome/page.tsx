'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Copy, Check } from 'lucide-react'
import { getSupabase, Profile } from '@/lib/supabase'
import BrandedQR from '@/components/BrandedQR'
import Button from '@/components/Button'
import { trackShare } from '@/lib/utils'

export default function WelcomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfile = async () => {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { data } = await getSupabase()
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setProfile(data)
    }
    setLoading(false)
  }

  const profileUrl = profile ? `${window.location.origin}/${profile.username}` : ''

  const whatsappMessage = `Check out my digital card! 🚀\n\nScan my QR or tap the link to connect with me instantly:\n${profileUrl}\n\nMade with Tappr — your network, one tap away ✨`

  const linkedinMessage = `Just created my digital networking card on Tappr! Connect with me instantly: ${profileUrl}`

  const handleWhatsAppShare = async () => {
    if (profile) {
      await trackShare(profile.id, 'whatsapp')
    }
    const encodedMessage = encodeURIComponent(whatsappMessage)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const handleLinkedInShare = async () => {
    if (profile) {
      await trackShare(profile.id, 'linkedin')
    }
    const encodedUrl = encodeURIComponent(profileUrl)
    const encodedText = encodeURIComponent(linkedinMessage)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`, '_blank')
  }

  const handleCopyLink = async () => {
    if (profile) {
      await trackShare(profile.id, 'copy')
    }
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-primary-500 to-indigo-600 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-primary-500 to-indigo-600 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl -top-24 -left-24 md:-top-48 md:-left-48 animate-pulse"></div>
        <div className="absolute w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl -bottom-24 -right-24 md:-bottom-48 md:-right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
              Your card is ready! 🎉
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90">
              Share it with the world and start connecting
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-8 lg:p-12 mb-6 md:mb-8 animate-scale-in">
            {/* QR Code */}
            <div className="flex justify-center mb-6 md:mb-8 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl md:rounded-2xl">
              <div className="w-[180px] h-[180px] md:w-[256px] md:h-[256px]">
                <BrandedQR
                  id="welcome-qr-code"
                  value={profileUrl}
                  size={256}
                />
              </div>
            </div>

            {/* Profile URL */}
            <div className="mb-6 md:mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Profile URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 min-w-0 px-3 md:px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs md:text-sm truncate"
                />
              </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="min-h-[44px] w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#1eab52] text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span className="text-lg">Share on WhatsApp</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleLinkedInShare}
                className="min-h-[44px] w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0077B5] hover:bg-[#006399] text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-lg">Share on LinkedIn</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="min-h-[44px] w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-6 h-6 text-green-500" />
                    <span className="text-lg text-green-500">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6" />
                    <span className="text-lg">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Go to Dashboard */}
          <div className="text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="min-h-[44px] inline-flex items-center gap-2 text-white hover:text-white/80 font-medium text-lg transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

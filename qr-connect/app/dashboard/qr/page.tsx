'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { getSupabase, Profile } from '@/lib/supabase'
import BrandedQR from '@/components/BrandedQR'
import { trackShare } from '@/lib/utils'

export default function QRFullscreenPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleWhatsAppShare = async () => {
    if (!profile) return
    const message = `Check out my digital card! 🚀\n\nScan my QR or tap the link to connect with me instantly:\n${profileUrl}\n\nMade with Tappr — your network, one tap away ✨`
    
    await trackShare(profile.id, 'whatsapp')
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-primary-400">Loading...</div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 cursor-pointer"
      onClick={() => router.back()}
    >
      {/* Close Button */}
      <button
        className="min-h-[44px] min-w-[44px] absolute top-8 right-8 text-gray-400 hover:text-white transition-colors"
        onClick={() => router.back()}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Content */}
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {profile?.display_name}
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Scan to connect with {profile?.display_name?.split(' ')[0]}
        </p>

        {/* QR Code */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl inline-block">
          <BrandedQR value={profileUrl} size={400} />
        </div>

        {/* WhatsApp Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleWhatsAppShare()
          }}
          className="min-h-[44px] mt-8 inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#1eab52] text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
          Share on WhatsApp
        </button>

        <p className="mt-8 text-gray-500 text-sm">
          Tap anywhere to close
        </p>
      </div>

      {/* Subtle branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-600 text-sm">
          Made with{' '}
          <span className="text-primary-500 font-semibold">Tappr</span>
        </p>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    handleCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCallback = async () => {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) { router.push('/login'); return }

    // Check if user has a profile with username
    const { data: profile } = await getSupabase()
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single()

    if (profile?.username) {
      // Existing user with profile — go to dashboard
      router.push('/dashboard')
    } else {
      // New Google user — needs to pick username
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-pulse text-primary-400 text-lg">Signing you in...</div>
    </div>
  )
}

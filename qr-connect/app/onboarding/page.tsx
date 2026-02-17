'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import { getSupabase } from '@/lib/supabase'
import { validateUsername } from '@/lib/utils'

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) { router.push('/login'); return }

    setUserId(session.user.id)
    setUserEmail(session.user.email || '')

    // Check if profile already has username
    const { data: profile } = await getSupabase()
      .from('profiles')
      .select('username, display_name')
      .eq('id', session.user.id)
      .single()

    if (profile?.username) {
      // Already onboarded
      router.push('/dashboard')
      return
    }

    // Pre-fill display name from Google profile
    const meta = session.user.user_metadata
    if (meta?.full_name) setDisplayName(meta.full_name)
    else if (meta?.name) setDisplayName(meta.name)

    setLoading(false)
  }

  const checkUsernameAvailability = async (value: string) => {
    if (!value) { setUsernameError(''); return }
    if (!validateUsername(value)) {
      setUsernameError('3-20 chars, lowercase letters, numbers, - or _')
      return
    }
    try {
      const { data } = await getSupabase()
        .from('profiles')
        .select('username')
        .eq('username', value.toLowerCase())
        .single()
      setUsernameError(data ? 'Username already taken' : '')
    } catch {
      setUsernameError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || usernameError || !username || !displayName) return
    setSaving(true)
    setError('')

    try {
      const { error: upsertError } = await getSupabase()
        .from('profiles')
        .upsert({
          id: userId,
          email: userEmail,
          username: username.toLowerCase(),
          display_name: displayName,
          plan_id: 'free',
        }, { onConflict: 'id' })

      if (upsertError) throw upsertError
      router.push('/dashboard/welcome')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-primary-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Tappr
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Almost there! Pick your username
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Display Name"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <div>
              <Input
                label="Username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => {
                  const v = e.target.value.toLowerCase()
                  setUsername(v)
                  checkUsernameAvailability(v)
                }}
                error={usernameError}
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your profile URL: tappr.in/<span className="text-primary-600">{username || 'username'}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !!usernameError || !username || !displayName}
              className="w-full py-3 px-4 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create My Card'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Chrome, User, AtSign } from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { getSupabase } from '@/lib/supabase'
import { validateUsername } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const checkUsernameAvailability = async (username: string) => {
    if (!username) {
      setUsernameError('')
      return
    }

    if (!validateUsername(username)) {
      setUsernameError('Username must be 3-20 characters, lowercase letters, numbers, - or _')
      return
    }

    try {
      const { data } = await getSupabase()
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (data) {
        setUsernameError('Username already taken')
      } else {
        setUsernameError('')
      }
    } catch (err) {
      // Username available (error means no match found)
      setUsernameError('')
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (usernameError) {
      setLoading(false)
      return
    }

    try {
      // Sign up user
      const { data: authData, error: authError } = await getSupabase().auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Create profile row explicitly
      const { error: profileError } = await getSupabase()
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email,
          username: username.toLowerCase(),
          display_name: displayName,
          plan_id: 'free',
        }, { onConflict: 'id' })

      if (profileError) throw profileError

      router.push('/dashboard/welcome')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Tappr
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your digital networking card
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 animate-scale-in">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Email signup */}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <Input
                type="text"
                label="Display Name"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Input
                type="text"
                label="Username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase()
                  setUsername(value)
                  checkUsernameAvailability(value)
                }}
                error={usernameError}
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your profile URL: tappr.in/<span className="text-primary-600">{username || 'username'}</span>
              </p>
            </div>

            <div>
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                At least 6 characters
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !!usernameError}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our{' '}
          <a href="#" className="underline hover:text-primary-600">Terms</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-primary-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

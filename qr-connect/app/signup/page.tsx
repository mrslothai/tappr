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
          redirectTo: `${window.location.origin}/auth/callback`,
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

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or sign up with email</span></div>
          </div>

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

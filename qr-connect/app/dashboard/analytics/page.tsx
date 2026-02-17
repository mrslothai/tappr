'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { ArrowUpRight, Eye, Clock, TrendingUp, Lock } from 'lucide-react'
import Button from '@/components/Button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Profile {
  id: string
  plan_id: string
}

interface ScanStat {
  total: number
  today: number
  week: number
  chartData: { date: string; count: number }[]
  recentScans: {
    scanned_at: string
    user_agent: string
    ip_address: string
  }[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<ScanStat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAnalytics = async () => {
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // Get profile with plan
      const { data: profileData } = await getSupabase()
        .from('profiles')
        .select('id, plan_id')
        .eq('id', session.user.id)
        .single()

      if (!profileData) return

      setProfile(profileData)

      // Get scan statistics
      const { data: scans } = await getSupabase()
        .from('profile_scans')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('scanned_at', { ascending: false })

      if (scans) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        const todayScans = scans.filter(s => new Date(s.scanned_at) >= today).length
        const weekScans = scans.filter(s => new Date(s.scanned_at) >= weekAgo).length

        // Generate chart data (last 30 days)
        const chartData: { date: string; count: number }[] = []
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
          const dateStr = date.toISOString().split('T')[0]
          const count = scans.filter(s => {
            const scanDate = new Date(s.scanned_at).toISOString().split('T')[0]
            return scanDate === dateStr
          }).length
          chartData.push({ date: dateStr, count })
        }

        setStats({
          total: scans.length,
          today: todayScans,
          week: weekScans,
          chartData,
          recentScans: scans.slice(0, 10),
        })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const isPro = profile?.plan_id === 'pro'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-primary-600">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Track your profile performance
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">← Back</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.total || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.week || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.today || 0}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Last 30 Days
            </h2>
            
            <div className={`relative ${!isPro ? 'filter blur-sm pointer-events-none' : ''}`}>
              <div className="h-64 flex items-end gap-1">
                {stats?.chartData.map((item, i) => {
                  const maxCount = Math.max(...(stats?.chartData.map(d => d.count) || [1]))
                  const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-primary-500 rounded-t-sm hover:bg-primary-600 transition-all cursor-pointer group relative"
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.count} views
                        <div className="text-gray-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {!isPro && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-gray-900/10 backdrop-blur-[2px] rounded-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-primary-500 p-8 max-w-md text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Unlock Advanced Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Upgrade to Pro to see detailed analytics, visitor insights, and more.
                  </p>
                  <Link href="/pricing">
                    <Button size="lg" className="w-full">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recent Scans */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Views
            </h2>
            
            <div className={`space-y-3 ${!isPro ? 'filter blur-sm' : ''}`}>
              {stats?.recentScans && stats.recentScans.length > 0 ? (
                stats.recentScans.map((scan, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(scan.scanned_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {scan.user_agent?.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {scan.ip_address || 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No views yet. Share your profile to start tracking!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

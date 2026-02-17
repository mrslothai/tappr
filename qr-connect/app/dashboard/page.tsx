'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
// QRCodeSVG kept for backward compat if needed
import { QRCodeSVG } from 'qrcode.react'
import {
  LogOut,
  Plus,
  Trash2,
  GripVertical,
  Download,
  Copy,
  Maximize2,
  Save,
  Eye,
  BarChart3,
} from 'lucide-react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import TapprLogo from '@/components/TapprLogo'
import PlatformIcon from '@/components/PlatformIcon'
import UpgradeModal from '@/components/UpgradeModal'
import { getSupabase, platformColors, Profile, Link as LinkType } from '@/lib/supabase'
import BrandedQR, { downloadQR } from '@/components/BrandedQR'
import { platforms, generateVCard, downloadVCard, trackShare } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPro = profile?.plan_id === 'pro'
  const maxLinks = isPro ? -1 : 5 // -1 means unlimited
  const canAddMoreLinks = maxLinks === -1 || links.length < maxLinks

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    await loadProfile(session.user.id)
    await loadLinks(session.user.id)
    setLoading(false)
  }

  const loadProfile = async (userId: string) => {
    const { data } = await getSupabase()
      .from('profiles')
      .select('*, plan_id')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setDisplayName(data.display_name)
      setBio(data.bio || '')
      setAvatarUrl(data.avatar_url || '')
    }
  }

  const loadLinks = async (profileId: string) => {
    const { data } = await getSupabase()
      .from('links')
      .select('*')
      .eq('profile_id', profileId)
      .order('sort_order')

    if (data) setLinks(data)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${profile.id}-${Date.now()}.${ext}`

      const { error: uploadError } = await getSupabase()
        .storage.from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = getSupabase()
        .storage.from('avatars')
        .getPublicUrl(fileName)

      setAvatarUrl(publicUrl)
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSaveProfile = async () => {
    if (!profile) return
    setSaving(true)
    setSaveMessage(null)

    try {
      const { error } = await getSupabase()
        .from('profiles')
        .update({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error
      
      // Update local profile state
      setProfile({ ...profile, display_name: displayName, bio, avatar_url: avatarUrl })
      setSaveMessage({ type: 'success', text: 'Profile saved!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: 'Failed to save: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleAddLink = async () => {
    if (!profile || !selectedPlatform || !newLinkUrl) return

    // Check plan limits
    if (!canAddMoreLinks) {
      setUpgradeReason(`You've reached the ${maxLinks} link limit on the Free plan. Upgrade to Pro for unlimited links!`)
      setShowUpgradeModal(true)
      return
    }

    try {
      const { error } = await getSupabase()
        .from('links')
        .insert([
          {
            profile_id: profile.id,
            platform: selectedPlatform,
            url: newLinkUrl,
            sort_order: links.length,
          },
        ])

      if (error) throw error

      await loadLinks(profile.id)
      setSelectedPlatform('')
      setNewLinkUrl('')
    } catch (err: any) {
      alert('Failed to add link: ' + err.message)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await getSupabase()
        .from('links')
        .delete()
        .eq('id', linkId)

      if (error) throw error
      await loadLinks(profile!.id)
    } catch (err: any) {
      alert('Failed to delete link: ' + err.message)
    }
  }

  const handleDownloadQR = () => {
    downloadQR('qr-code-container', `${profile?.username}-qr`)
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${profile?.username}`
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  const handleWhatsAppShare = async () => {
    if (!profile) return
    const url = `${window.location.origin}/${profile.username}`
    const message = `Check out my digital card! 🚀\n\nScan my QR or tap the link to connect with me instantly:\n${url}\n\nMade with Tappr — your network, one tap away ✨`
    
    await trackShare(profile.id, 'whatsapp')
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const handleSignOut = async () => {
    await getSupabase().auth.signOut()
    router.push('/')
  }

  const profileUrl = profile ? `${window.location.origin}/${profile.username}` : ''

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-primary-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 overflow-x-hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <TapprLogo size="sm" />
            </Link>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {!isPro && (
                <Link href="/pricing">
                  <Button size="sm" className="bg-gradient-to-r from-primary-600 to-purple-600">
                    Upgrade
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Analytics</span>
                </Button>
              </Link>
              <a
                href={`/${profile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Preview</span>
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Editor */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Edit Profile
              </h2>

              <div className="space-y-4">
                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Product Designer | Coffee Enthusiast"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                        {displayName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        {uploadingAvatar ? 'Uploading...' : avatarUrl ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      {avatarUrl && (
                        <button
                          onClick={() => setAvatarUrl('')}
                          className="min-h-[44px] ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>

                {saveMessage && (
                  <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
                    saveMessage.type === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {saveMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Social Links
                </h2>
                {!isPro && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {links.length}/{maxLinks} used
                  </span>
                )}
              </div>

              {/* Existing Links */}
              <div className="space-y-3 mb-6">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab flex-shrink-0" />
                    <div className="flex-shrink-0">
                      <PlatformIcon platform={link.platform} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {link.platform}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {link.url}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Link */}
              <div className="space-y-3">
                {!canAddMoreLinks && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                      You&apos;ve reached the {maxLinks} link limit on the Free plan.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setUpgradeReason(`Upgrade to Pro for unlimited links and more features!`)
                        setShowUpgradeModal(true)
                      }}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
                
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  disabled={!canAddMoreLinks}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select platform...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {selectedPlatform && canAddMoreLinks && (
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        platforms.find((p) => p.id === selectedPlatform)?.placeholder ||
                        'Enter URL'
                      }
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddLink}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Preview & QR */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* QR Code Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Your QR Code
              </h2>

              <div className="flex justify-center p-8 bg-white rounded-xl mb-6">
                <div className="w-full max-w-[256px]">
                  <BrandedQR
                    id="qr-code-container"
                    value={profileUrl}
                    size={256}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Button variant="secondary" size="sm" onClick={handleDownloadQR} className="flex-1 min-w-[100px]">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCopyLink} className="flex-1 min-w-[100px]">
                  <Copy className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="min-h-[44px] flex-1 min-w-[120px] inline-flex items-center justify-center px-3 py-1.5 text-sm bg-[#25D366] hover:bg-[#1eab52] text-white rounded-lg font-medium transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  <span className="hidden sm:inline">Share</span>
                </button>
                <a href="/dashboard/qr" target="_blank" className="flex-1 min-w-[100px]">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Maximize2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Live Preview
              </h2>

              <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-purple-500"></div>
                  )}
                </div>

                {/* Name & Bio */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {displayName || 'Your Name'}
                  </h3>
                  {bio && (
                    <p className="text-gray-600 dark:text-gray-400">{bio}</p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white break-words ${
                        platformColors[link.platform] || platformColors.custom
                      }`}
                    >
                      <PlatformIcon platform={link.platform} className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium capitalize flex-1 min-w-0">{link.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
      />
    </div>
  )
}

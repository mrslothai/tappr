'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
import Input from '@/components/Input'
import TapprLogo from '@/components/TapprLogo'
import PlatformIcon from '@/components/PlatformIcon'
import UpgradeModal from '@/components/UpgradeModal'
import { getSupabase, platformColors, Profile, Link as LinkType } from '@/lib/supabase'
import BrandedQR, { downloadQR } from '@/components/BrandedQR'
import { platforms, trackShare } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPro = profile?.plan_id === 'pro'
  const maxLinks = isPro ? -1 : 5
  const canAddMoreLinks = maxLinks === -1 || links.length < maxLinks

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await getSupabase().auth.getSession()
    if (!session) { router.push('/login'); return }
    await loadProfile(session.user.id)
    await loadLinks(session.user.id)
    setLoading(false)
  }

  const loadProfile = async (userId: string) => {
    const { data } = await getSupabase().from('profiles').select('*, plan_id').eq('id', userId).single()
    if (data) { setProfile(data); setDisplayName(data.display_name); setBio(data.bio || ''); setAvatarUrl(data.avatar_url || '') }
  }

  const loadLinks = async (profileId: string) => {
    const { data } = await getSupabase().from('links').select('*').eq('profile_id', profileId).order('sort_order')
    if (data) setLinks(data)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${profile.id}-${Date.now()}.${ext}`
      const { error: uploadError } = await getSupabase().storage.from('avatars').upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = getSupabase().storage.from('avatars').getPublicUrl(fileName)
      setAvatarUrl(publicUrl)
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    setSaving(true); setSaveMessage(null)
    try {
      const { error } = await getSupabase().from('profiles').update({ display_name: displayName, bio, avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq('id', profile.id)
      if (error) throw error
      setProfile({ ...profile, display_name: displayName, bio, avatar_url: avatarUrl })
      setSaveMessage({ type: 'success', text: 'Profile saved!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: 'Failed to save: ' + err.message })
    } finally { setSaving(false) }
  }

  const handleAddLink = async () => {
    if (!profile || !selectedPlatform || !newLinkUrl) return
    if (!canAddMoreLinks) { setUpgradeReason(`You've reached the ${maxLinks} link limit. Upgrade to Pro for unlimited links!`); setShowUpgradeModal(true); return }
    try {
      const { error } = await getSupabase().from('links').insert([{ profile_id: profile.id, platform: selectedPlatform, url: newLinkUrl, sort_order: links.length }])
      if (error) throw error
      await loadLinks(profile.id); setSelectedPlatform(''); setNewLinkUrl('')
    } catch (err: any) { alert('Failed to add link: ' + err.message) }
  }

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await getSupabase().from('links').delete().eq('id', linkId)
      if (error) throw error
      await loadLinks(profile!.id)
    } catch (err: any) { alert('Failed to delete link: ' + err.message) }
  }

  const handleDownloadQR = () => { downloadQR('qr-code-container', `${profile?.username}-qr`) }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${profile?.username}`)
    alert('Link copied!')
  }

  const handleWhatsAppShare = async () => {
    if (!profile) return
    const url = `${window.location.origin}/${profile.username}`
    const message = `Check out my digital card! 🚀\n\nScan my QR or tap the link to connect with me instantly:\n${url}\n\nMade with Tappr — your network, one tap away ✨`
    await trackShare(profile.id, 'whatsapp')
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleSignOut = async () => { await getSupabase().auth.signOut(); router.push('/') }

  const profileUrl = profile ? `${window.location.origin}/${profile.username}` : ''

  if (loading) {
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-pulse text-primary-600">Loading...</div></div>)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 w-full">
        <div className="flex items-center justify-between px-3 py-2.5 md:px-6 md:py-4 max-w-7xl mx-auto">
          <Link href="/dashboard" className="flex-shrink-0">
            <TapprLogo size="sm" />
          </Link>
          <div className="flex items-center gap-1">
            {!isPro && (
              <Link href="/pricing" className="px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg">
                Upgrade
              </Link>
            )}
            <Link href="/dashboard/analytics" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </Link>
            <a href={`/${profile?.username}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg">
              <Eye className="w-5 h-5" />
            </a>
            <button onClick={handleSignOut} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-3 py-4 md:px-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">

          {/* Left Column: Editor */}
          <div className="space-y-4 min-w-0 w-full">

            {/* Edit Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 w-full overflow-hidden box-border">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h2>

              <div className="space-y-4 w-full">
                <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="John Doe" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Product Designer | Coffee Enthusiast"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm box-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {displayName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        {uploadingAvatar ? 'Uploading...' : avatarUrl ? 'Change Photo' : 'Upload Photo'}
                      </button>
                      {avatarUrl && (
                        <button onClick={() => setAvatarUrl('')} className="px-2 py-2 text-xs text-red-500 hover:text-red-700 font-medium">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-3 px-4 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 box-border"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>

                {saveMessage && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${saveMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                    {saveMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 w-full overflow-hidden box-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
                {!isPro && <span className="text-xs text-gray-500 dark:text-gray-400">{links.length}/{maxLinks}</span>}
              </div>

              <div className="space-y-2 mb-4">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-shrink-0"><PlatformIcon platform={link.platform} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{link.platform}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</p>
                    </div>
                    <button onClick={() => handleDeleteLink(link.id)} className="p-1.5 text-red-500 hover:text-red-700 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {!canAddMoreLinks && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">You&apos;ve hit the {maxLinks} link limit.</p>
                    <button onClick={() => { setUpgradeReason('Upgrade to Pro for unlimited links!'); setShowUpgradeModal(true) }} className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg">
                      Upgrade to Pro
                    </button>
                  </div>
                )}
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  disabled={!canAddMoreLinks}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 box-border"
                >
                  <option value="">Select platform...</option>
                  {platforms.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
                {selectedPlatform && canAddMoreLinks && (
                  <div className="flex gap-2">
                    <input
                      placeholder={platforms.find((p) => p.id === selectedPlatform)?.placeholder || 'Enter URL'}
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 box-border"
                    />
                    <button onClick={handleAddLink} className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: QR & Preview */}
          <div className="space-y-4 min-w-0 w-full lg:sticky lg:top-20 h-fit">

            {/* QR Code Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 w-full overflow-hidden box-border">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your QR Code</h2>

              <div className="flex justify-center p-4 md:p-6 bg-white rounded-xl mb-4">
                <div className="w-full max-w-[200px] md:max-w-[256px]">
                  <BrandedQR id="qr-code-container" value={profileUrl} size={256} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={handleDownloadQR} className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button onClick={handleCopyLink} className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Copy className="w-4 h-4" /> Copy Link
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleWhatsAppShare} className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm bg-[#25D366] hover:bg-[#1eab52] text-white rounded-lg font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  WhatsApp
                </button>
                <a href="/dashboard/qr" target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Maximize2 className="w-4 h-4" /> Fullscreen
                </a>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 w-full overflow-hidden box-border">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h2>

              <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 md:p-6">
                <div className="flex justify-center mb-4">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-purple-500"></div>
                  )}
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{displayName || 'Your Name'}</h3>
                  {bio && <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{bio}</p>}
                </div>
                <div className="space-y-2">
                  {links.map((link) => (
                    <div key={link.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-white text-sm ${platformColors[link.platform] || platformColors.custom}`}>
                      <PlatformIcon platform={link.platform} className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium capitalize truncate">{link.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} reason={upgradeReason} />
    </div>
  )
}

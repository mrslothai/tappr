import { notFound } from 'next/navigation'
import PlatformIcon from '@/components/PlatformIcon'
import { getSupabase, platformColors } from '@/lib/supabase'
import SaveContactButton from './SaveContactButton'
import ProfileAvatar from './ProfileAvatar'
import ScanTracker from './ScanTracker'
import ShareButton from './ShareButton'

export const dynamic = 'force-dynamic'

function isValidImageUrl(url: string | null): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.toLowerCase()
    // Accept known image hosts or URLs ending in image extensions
    if (parsed.hostname.includes('supabase')) return true
    if (parsed.hostname.includes('githubusercontent')) return true
    if (parsed.hostname.includes('cloudinary')) return true
    if (parsed.hostname.includes('imgur')) return true
    if (/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/.test(path)) return true
    return false
  } catch {
    return false
  }
}

async function getProfile(username: string) {
  try {
    const supabase = getSupabase()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, plan_id')
      .eq('username', username.toLowerCase())
      .single()

    if (!profile) return null

    const { data: links } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', profile.id)
      .order('sort_order')

    return { profile, links: links || [] }
  } catch {
    return null
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const data = await getProfile(params.username)

  if (!data) {
    notFound()
  }

  const { profile, links } = data
  const isPro = profile.plan_id === 'pro'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Scan Tracker */}
      <ScanTracker profileId={profile.id} />
      
      {/* Share Button */}
      <ShareButton 
        profileId={profile.id} 
        displayName={profile.display_name} 
        username={profile.username} 
      />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 animate-scale-in">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <ProfileAvatar src={isValidImageUrl(profile.avatar_url) ? profile.avatar_url : null} name={profile.display_name} />
            </div>

            {/* Name & Bio */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {profile.display_name}
              </h1>
              {profile.bio && (
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-4 mb-8">
              {links.map((link: { id: string; platform: string; url: string; label: string | null }) => (
                <a
                  key={link.id}
                  href={
                    link.platform === 'email'
                      ? `mailto:${link.url}`
                      : link.platform === 'phone'
                      ? `tel:${link.url}`
                      : link.url.startsWith('http')
                      ? link.url
                      : `https://${link.url}`
                  }
                  target={link.platform === 'email' || link.platform === 'phone' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                    platformColors[link.platform] || platformColors.custom
                  }`}
                >
                  <PlatformIcon platform={link.platform} className="w-6 h-6" />
                  <span className="capitalize text-lg">
                    {link.label || link.platform}
                  </span>
                </a>
              ))}
            </div>

            {/* Save Contact Button */}
            <SaveContactButton profile={profile} links={links} />
          </div>

          {/* Branding - Only show for free users */}
          {!isPro && (
            <div className="text-center mt-8">
              <a
                href="/"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Made with <span className="font-semibold">Tappr</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

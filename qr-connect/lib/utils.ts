export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

export function generateVCard(profile: any, links: any[]): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.display_name}`,
    profile.bio ? `NOTE:${profile.bio}` : '',
    ...links.map(link => {
      if (link.platform === 'email') return `EMAIL:${link.url}`
      if (link.platform === 'phone') return `TEL:${link.url}`
      return `URL:${link.url}`
    }),
    'END:VCARD'
  ].filter(Boolean).join('\n')
  
  return vcard
}

export function downloadVCard(vcard: string, filename: string) {
  const blob = new Blob([vcard], { type: 'text/vcard' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export const platforms = [
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
  { id: 'twitter', name: 'Twitter/X', placeholder: 'twitter.com/username' },
  { id: 'instagram', name: 'Instagram', placeholder: 'instagram.com/username' },
  { id: 'github', name: 'GitHub', placeholder: 'github.com/username' },
  { id: 'youtube', name: 'YouTube', placeholder: 'youtube.com/@channel' },
  { id: 'website', name: 'Website', placeholder: 'yourwebsite.com' },
  { id: 'email', name: 'Email', placeholder: 'your@email.com' },
  { id: 'phone', name: 'Phone', placeholder: '+1234567890' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: 'wa.me/1234567890' },
  { id: 'telegram', name: 'Telegram', placeholder: 't.me/username' },
  { id: 'discord', name: 'Discord', placeholder: 'discord.gg/invite' },
  { id: 'medium', name: 'Medium', placeholder: 'medium.com/@username' },
  { id: 'dribbble', name: 'Dribbble', placeholder: 'dribbble.com/username' },
  { id: 'behance', name: 'Behance', placeholder: 'behance.net/username' },
  { id: 'custom', name: 'Custom URL', placeholder: 'any-url.com' },
]

export async function trackShare(profileId: string, platform: string): Promise<void> {
  try {
    await fetch('/api/track-share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile_id: profileId,
        platform,
      }),
    })
  } catch (error) {
    console.error('Failed to track share:', error)
    // Fail silently, don't block the share action
  }
}

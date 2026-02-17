'use client'

import { Download } from 'lucide-react'
import { generateVCard } from '@/lib/utils'
import type { Profile, Link } from '@/lib/supabase'

export default function SaveContactButton({ profile, links }: { profile: Profile; links: Link[] }) {
  const handleSave = () => {
    const vcard = generateVCard(profile, links)
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.username}.vcf`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={handleSave}
        className="min-h-[44px] flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-all duration-200"
      >
        <Download className="w-5 h-5" />
        Save Contact
      </button>
    </div>
  )
}

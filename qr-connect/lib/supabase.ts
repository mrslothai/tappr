import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function getSupabase() {
  if (!supabase) throw new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  return supabase
}

export type Profile = {
  id: string
  email: string | null
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  plan_id: string
  created_at: string
  updated_at: string
}

export type Link = {
  id: string
  profile_id: string
  platform: string
  url: string
  label: string | null
  sort_order: number
  created_at: string
}

export const platformColors: Record<string, string> = {
  linkedin: 'bg-[#0077B5] hover:bg-[#006399]',
  twitter: 'bg-black hover:bg-gray-800',
  instagram: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90',
  github: 'bg-[#333] hover:bg-[#24292e]',
  youtube: 'bg-[#FF0000] hover:bg-[#cc0000]',
  website: 'bg-primary-600 hover:bg-primary-700',
  email: 'bg-gray-600 hover:bg-gray-700',
  phone: 'bg-green-600 hover:bg-green-700',
  whatsapp: 'bg-[#25D366] hover:bg-[#1eab52]',
  telegram: 'bg-[#0088cc] hover:bg-[#0077b3]',
  discord: 'bg-[#5865F2] hover:bg-[#4752c4]',
  medium: 'bg-black hover:bg-gray-800',
  dribbble: 'bg-[#EA4C89] hover:bg-[#d63b75]',
  behance: 'bg-[#1769ff] hover:bg-[#0057e6]',
  custom: 'bg-gray-700 hover:bg-gray-600',
}

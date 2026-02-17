import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile_id, platform } = body

    if (!profile_id || !platform) {
      return NextResponse.json(
        { error: 'Missing profile_id or platform' },
        { status: 400 }
      )
    }

    const { error } = await getSupabase()
      .from('profile_shares')
      .insert([
        {
          profile_id,
          platform,
        },
      ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Track share error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track share' },
      { status: 500 }
    )
  }
}

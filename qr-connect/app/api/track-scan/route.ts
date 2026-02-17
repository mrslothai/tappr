import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile_id, user_agent, referrer } = body

    if (!profile_id) {
      return NextResponse.json({ error: 'Missing profile_id' }, { status: 400 })
    }

    // Extract IP address from headers
    const ip_address = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      null

    // Insert scan record
    const { error } = await getSupabase()
      .from('profile_scans')
      .insert([
        {
          profile_id,
          ip_address,
          user_agent,
          referrer,
          scanned_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Error tracking scan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in track-scan API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

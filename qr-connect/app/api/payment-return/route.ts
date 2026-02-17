import { NextRequest, NextResponse } from 'next/server'
import { getCashfree } from '@/lib/cashfree'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('order_id')
  
  if (!orderId) {
    return NextResponse.redirect(new URL('/pricing?error=missing_order', request.url))
  }

  try {
    const cashfree = getCashfree()
    const response = await cashfree.PGOrderFetchPayments(orderId)
    const payments = response.data

    const successPayment = payments?.find(
      (p: any) => p.payment_status === 'SUCCESS'
    )

    if (successPayment) {
      // Get order from DB to find user
      const { data: order } = await getSupabaseAdmin()
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (order) {
        // Upgrade user to Pro
        const now = new Date()
        const expiresAt = new Date(now)
        if (order.plan_id === 'pro_yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1)
        }

        // Update profile
        await getSupabaseAdmin()
          .from('profiles')
          .update({ plan_id: 'pro' })
          .eq('id', order.user_id)

        // Create/update subscription
        await getSupabaseAdmin().from('subscriptions').upsert({
          user_id: order.user_id,
          plan_id: order.plan_id,
          status: 'active',
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          cashfree_order_id: orderId,
          amount: order.amount,
        }, { onConflict: 'user_id' })

        // Update order status
        await getSupabaseAdmin()
          .from('orders')
          .update({ 
            status: 'paid',
            payment_id: successPayment.cf_payment_id,
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId)
      }

      return NextResponse.redirect(new URL('/dashboard?upgraded=true', request.url))
    } else {
      // Payment failed or pending
      await getSupabaseAdmin()
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', orderId)

      return NextResponse.redirect(new URL('/pricing?error=payment_failed', request.url))
    }
  } catch (error: any) {
    console.error('Payment return error:', error)
    return NextResponse.redirect(new URL('/pricing?error=verification_failed', request.url))
  }
}

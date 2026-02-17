import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function verifyWebhookSignature(body: string, signature: string): boolean {
  const secretKey = process.env.CASHFREE_SECRET_KEY!
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('base64')
  return signature === expectedSignature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature') || ''

    // Verify signature in production
    if (process.env.CASHFREE_ENV === 'production') {
      if (!verifyWebhookSignature(body, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const data = JSON.parse(body)
    const eventType = data.type

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      const payment = data.data?.payment
      const order = data.data?.order

      if (!order?.order_id) {
        return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
      }

      // Get order from DB
      const { data: dbOrder } = await getSupabaseAdmin()
        .from('orders')
        .select('*')
        .eq('id', order.order_id)
        .single()

      if (dbOrder && dbOrder.status !== 'paid') {
        const now = new Date()
        const expiresAt = new Date(now)
        if (dbOrder.plan_id === 'pro_yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1)
        }

        // Upgrade user
        await getSupabaseAdmin()
          .from('profiles')
          .update({ plan_id: 'pro' })
          .eq('id', dbOrder.user_id)

        // Create subscription
        await getSupabaseAdmin().from('subscriptions').upsert({
          user_id: dbOrder.user_id,
          plan_id: dbOrder.plan_id,
          status: 'active',
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          cashfree_order_id: order.order_id,
          amount: dbOrder.amount,
        }, { onConflict: 'user_id' })

        // Update order
        await getSupabaseAdmin()
          .from('orders')
          .update({
            status: 'paid',
            payment_id: payment?.cf_payment_id,
            paid_at: new Date().toISOString(),
          })
          .eq('id', order.order_id)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

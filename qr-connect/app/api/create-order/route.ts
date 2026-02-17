import { NextRequest, NextResponse } from 'next/server'
import { getCashfree, PLANS } from '@/lib/cashfree'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, planId, phone } = await request.json()

    if (!userId || !email || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const orderId = `tappr_${planId}_${userId.slice(0, 8)}_${Date.now()}`

    const cashfree = getCashfree()

    const orderRequest = {
      order_amount: plan.amount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: userId,
        customer_email: email,
        customer_phone: phone || '9999999999',
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tappr.in'}/api/payment-return?order_id=${orderId}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://tappr.in'}/api/payment-webhook`,
      },
      order_note: `Tappr ${plan.name}`,
      order_tags: {
        plan_id: planId,
        user_id: userId,
      },
    }

    const response = await cashfree.PGCreateOrder(orderRequest)
    const orderData = response.data

    // Store order in database
    await getSupabaseAdmin().from('orders').insert({
      id: orderId,
      user_id: userId,
      plan_id: planId,
      amount: plan.amount,
      currency: 'INR',
      status: 'created',
      cashfree_order_id: orderData.cf_order_id,
      payment_session_id: orderData.payment_session_id,
    })

    return NextResponse.json({
      orderId,
      paymentSessionId: orderData.payment_session_id,
      orderAmount: plan.amount,
    })
  } catch (error: any) {
    const detail = error?.response?.data || error?.message || String(error)
    console.error('Create order error:', JSON.stringify(detail))
    return NextResponse.json(
      { error: typeof detail === 'object' ? JSON.stringify(detail) : detail },
      { status: 500 }
    )
  }
}

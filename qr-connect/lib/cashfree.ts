import { Cashfree, CFEnvironment } from 'cashfree-pg'

const isProduction = process.env.CASHFREE_ENV === 'production'

export function getCashfree() {
  return new Cashfree(
    isProduction ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID!,
    process.env.CASHFREE_SECRET_KEY!
  )
}

export const PLANS = {
  pro_monthly: {
    name: 'Tappr Pro — Monthly',
    amount: 149,
    interval: 'monthly' as const,
  },
  pro_yearly: {
    name: 'Tappr Pro — Yearly',
    amount: 1199,
    interval: 'yearly' as const,
  },
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'
import { getSupabase } from '@/lib/supabase'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [upgrading, setUpgrading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      if (session) {
        setUserId(session.user.id)
        setUserEmail(session.user.email || '')
      }
    })
    // Check URL params for payment errors
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    if (error === 'payment_failed') setPaymentError('Payment failed. Please try again.')
    if (error === 'verification_failed') setPaymentError('Payment verification failed. Contact support.')
  }, [])

  const handleUpgrade = async () => {
    if (!isLoggedIn) { window.location.href = '/signup'; return }
    setUpgrading(true)
    setPaymentError('')

    try {
      const planId = billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly'
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email: userEmail, planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      // Load Cashfree checkout
      const cashfree = await loadCashfreeCheckout()
      if (cashfree) {
        cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: '_self' })
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Something went wrong')
      setUpgrading(false)
    }
  }

  const loadCashfreeCheckout = (): Promise<any> => {
    return new Promise((resolve) => {
      if ((window as any).Cashfree) {
        resolve(new (window as any).Cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox' }))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.onload = () => {
        resolve(new (window as any).Cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox' }))
      }
      script.onerror = () => resolve(null)
      document.head.appendChild(script)
    })
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Up to 5 social links',
        'QR code generation',
        'Custom username',
        'Mobile responsive',
        'Basic customization',
      ],
      cta: isLoggedIn ? 'Go to Dashboard' : 'Get Started',
      ctaLink: isLoggedIn ? '/dashboard' : '/signup',
      icon: Sparkles,
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals who want more',
      price: { monthly: 149, yearly: 1199 },
      features: [
        'Unlimited social links',
        'Advanced analytics & insights',
        'Remove "Made with Tappr" branding',
        'Branded QR code',
        'Custom themes & colors ::coming',
        'Lead capture forms ::coming',
        'Multiple digital cards ::coming',
        'Custom domain ::coming',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      ctaLink: isLoggedIn ? '/dashboard' : '/signup',
      icon: Zap,
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Tappr
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Payment Error */}
      {paymentError && (
        <div className="container mx-auto px-4 pt-6">
          <div className="max-w-xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{paymentError}</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Plan
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Start free. Upgrade when you need more power.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`min-h-[44px] px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`min-h-[44px] px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
            const pricePerMonth = billingCycle === 'yearly' ? Math.round(price / 12) : price

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 p-8 ${
                  plan.popular
                    ? 'border-primary-500 dark:border-primary-400'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ₹{pricePerMonth}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /month
                    </span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      ₹{price} billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => {
                    const isComingSoon = feature.endsWith('::coming')
                    const label = feature.replace(' ::coming', '')
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 ${isComingSoon ? 'bg-gray-100 dark:bg-gray-700' : 'bg-green-100 dark:bg-green-900/30'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className={`w-3 h-3 ${isComingSoon ? 'text-gray-400 dark:text-gray-500' : 'text-green-600 dark:text-green-400'}`} />
                        </div>
                        <span className={`${isComingSoon ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {label}
                          {isComingSoon && (
                            <span className="ml-2 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                              Coming Soon
                            </span>
                          )}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {plan.id === 'pro' && isLoggedIn ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    {upgrading ? 'Processing...' : plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                <Link href={plan.ctaLink}>
                  <Button
                    size="lg"
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full group"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Compare Plans
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { name: 'Social Links', free: '5', pro: 'Unlimited' },
                  { name: 'QR Code', free: true, pro: true },
                  { name: 'Analytics', free: false, pro: true },
                  { name: 'Remove Branding', free: false, pro: true },
                  { name: 'Branded QR Code', free: false, pro: true },
                  { name: 'Custom Themes 🔜', free: false, pro: true },
                  { name: 'Lead Capture 🔜', free: false, pro: true },
                  { name: 'Custom Domain 🔜', free: false, pro: true },
                  { name: 'Priority Support', free: false, pro: true },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.free === 'boolean' ? (
                        item.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.free}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.pro === 'boolean' ? (
                        item.pro ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.pro}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'Can I upgrade or downgrade anytime?',
                  a: 'Yes! You can upgrade to Pro anytime. If you downgrade, your Pro features will remain active until the end of your billing period.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay.',
                },
                {
                  q: 'Is there a refund policy?',
                  a: 'Yes, we offer a 7-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
                },
                {
                  q: 'What happens to my data if I cancel?',
                  a: 'Your profile and data remain accessible. You\'ll just lose access to Pro features.',
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of professionals using Tappr
            </p>
            <Link href={isLoggedIn ? '/dashboard' : '/signup'} className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-white text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              {isLoggedIn ? 'Go to Dashboard' : 'Create Your Free Account'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

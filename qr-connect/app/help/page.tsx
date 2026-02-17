'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, ChevronDown, ChevronUp, Mail, MessageCircle, ArrowLeft } from 'lucide-react'

const faqs = [
  {
    q: 'How do I create my digital card?',
    a: 'Sign up for free, add your name, bio, and social links. Your card is instantly live at tappr.in/yourusername.',
  },
  {
    q: 'Is Tappr really free?',
    a: 'Yes! The free plan includes up to 5 social links, a QR code, and a custom username. No credit card required.',
  },
  {
    q: 'How do I share my card?',
    a: 'You can share via QR code (show or download), WhatsApp, copy link, or any other platform. People scan or tap to see your profile.',
  },
  {
    q: 'What do I get with Pro?',
    a: 'Pro gives you unlimited links, advanced analytics, removes Tappr branding, and a branded QR code. Custom themes, lead capture, and custom domains are coming soon.',
  },
  {
    q: 'How do I upgrade to Pro?',
    a: 'Go to the Pricing page and click "Upgrade to Pro". You can pay via UPI, cards, or net banking through our secure payment gateway.',
  },
  {
    q: 'Can I cancel my Pro subscription?',
    a: 'Yes, you can cancel anytime. Your Pro features will remain active until the end of your billing period.',
  },
  {
    q: 'How do I change my username?',
    a: 'Currently, usernames can\'t be changed after signup. Contact us at the email below and we\'ll help you out.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use Supabase (built on PostgreSQL) with row-level security. Your data is encrypted and only you can access your account.',
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Open mailto link with pre-filled content
    const subject = encodeURIComponent(`Tappr Help: Query from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:hello@tappr.in?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSending(false)
      setSent(true)
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setSent(false), 5000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Tappr
            </h1>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            How can we help?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Find answers below or send us a message
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Still need help?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Send us your question and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 text-primary-500" />
                <a href="mailto:hello@tappr.in" className="hover:text-primary-600">
                  hello@tappr.in
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span>We typically respond within a few hours</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✉️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email client opened!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Send the email from your mail app and we&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe your issue or question..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Opening mail...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

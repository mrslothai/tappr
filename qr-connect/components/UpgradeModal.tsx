'use client'

import { X, Zap, Check, ArrowRight } from 'lucide-react'
import Button from './Button'
import Link from 'next/link'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  reason?: string
}

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  if (!isOpen) return null

  const proFeatures = [
    'Unlimited social links',
    'Advanced analytics & insights',
    'Remove branding',
    'Custom themes',
    'Lead capture forms',
    'Multiple digital cards',
    'Priority support',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full border-2 border-primary-500 dark:border-primary-400 animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-t-3xl p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
            <Zap className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Upgrade to Pro</h2>
          <p className="text-primary-100">
            {reason || 'Unlock all premium features and take your networking to the next level'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Pricing */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">₹149</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              or ₹1,199/year (save 33%)
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {proFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href="/pricing">
              <Button size="lg" className="w-full group">
                View Pricing Plans
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              onClick={onClose}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>

          {/* Guarantee */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            7-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}

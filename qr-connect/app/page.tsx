'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BrandedQR from '@/components/BrandedQR'
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Zap, 
  QrCode,
  BarChart3,
  Users,
  Palette,
  CreditCard,
  Download,
  Briefcase,
  UserCheck,
  Building2,
  Instagram,
  Youtube,
  MessageCircle,
  Star
} from 'lucide-react'
import Button from '@/components/Button'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-48 h-48 md:w-96 md:h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '2s' }}
        ></div>
      </div>

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Tappr
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="md">Get Started</Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 md:py-32 overflow-hidden">
        {/* Floating decorative elements */}
        <div className="hidden md:block absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="hidden md:block absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="hidden md:block absolute bottom-40 left-1/4 w-16 h-16 border-2 border-purple-500/30 rounded-full"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight">
                <span className="text-white">Your network,</span>
                <br />
                <span 
                  className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse"
                  style={{ animationDuration: '3s' }}
                >
                  one tap away
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-xl">
                The intelligent digital business card that adapts to how you work. 
                Share your entire professional presence in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm md:text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors group">
                  Create Your Card — Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 text-sm md:text-base font-medium text-white border border-white/20 hover:bg-white/10 rounded-lg transition-colors">
                  See Demo
                </Link>
              </div>
            </div>

            {/* Right: Animated Card Mockup */}
            <div className="relative lg:block">
              <div 
                className="relative mx-auto max-w-sm"
                style={{
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                {/* Card Shadow/Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-3xl blur-3xl transform scale-105"></div>
                
                {/* Card */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                      R
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-white">Rajesh Chityal</h3>
                      <p className="text-sm md:text-base text-gray-400">AI Developer & Creator</p>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                    <button className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform shadow-lg">
                      <Instagram className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-sm md:text-base text-white font-medium">Instagram</span>
                    </button>
                    <button className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-red-600 hover:scale-105 transition-transform shadow-lg">
                      <Youtube className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-sm md:text-base text-white font-medium">YouTube</span>
                    </button>
                    <button className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-green-600 hover:scale-105 transition-transform shadow-lg">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-sm md:text-base text-white font-medium">WhatsApp</span>
                    </button>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex justify-center p-3 md:p-6 bg-white rounded-xl md:rounded-2xl">
                    <div className="w-24 h-24 md:w-40 md:h-40">
                      <BrandedQR value="https://tappr.in/rajeshchityal" size={160} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </section>

      {/* Stats Bar */}
      <section className="relative py-6 md:py-8 border-y border-white/5 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-row justify-center items-center gap-6 md:gap-12 text-center">
            <div>
              <div className="text-2xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-xs md:text-sm text-gray-400">Cards Created</div>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/10"></div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-white">10K+</div>
              <div className="text-xs md:text-sm text-gray-400">Scans</div>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/10"></div>
            <div>
              <div className="flex items-center justify-center gap-1 text-2xl md:text-4xl font-bold text-white">
                4.9
                <Star className="w-5 h-5 md:w-7 md:h-7 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-xs md:text-sm text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                Why Tappr?
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to make networking effortless
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: QrCode,
                  title: 'Instant QR Sharing',
                  description: 'Generate your unique QR code and share all your links in one scan',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: BarChart3,
                  title: 'Analytics Dashboard',
                  description: 'Track scans, views, and engagement with detailed analytics',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Users,
                  title: 'Lead Capture',
                  description: 'Collect contact information from people who scan your card',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: Palette,
                  title: 'Custom Themes',
                  description: 'Personalize your card with colors, fonts, and layouts that match your brand',
                  gradient: 'from-orange-500 to-red-500'
                },
                {
                  icon: CreditCard,
                  title: 'Multiple Cards',
                  description: 'Create different cards for work, personal, events, or projects',
                  gradient: 'from-purple-500 to-indigo-500'
                },
                {
                  icon: Download,
                  title: 'Save Contact (vCard)',
                  description: 'Let people save your contact directly to their phone with one tap',
                  gradient: 'from-pink-500 to-rose-500'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:scale-105 hover:bg-white/10 transition-all duration-300"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0
                  }}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* How It Works */}
      <section className="relative py-16 md:py-32 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                How It Works
              </h2>
              <p className="text-lg md:text-xl text-gray-400">
                Get started in under 2 minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50"></div>

              {[
                {
                  number: '01',
                  icon: UserCheck,
                  title: 'Create',
                  description: 'Sign up and choose your unique username. Setup takes seconds.'
                },
                {
                  number: '02',
                  icon: Palette,
                  title: 'Customize',
                  description: 'Add your links, customize colors, and make it yours.'
                },
                {
                  number: '03',
                  icon: QrCode,
                  title: 'Share',
                  description: 'Show your QR code and connect instantly. That&apos;s it.'
                }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:bg-white/10 transition-all duration-300">
                    {/* Number badge */}
                    <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg z-10">
                      {step.number}
                    </div>
                    
                    <div className="mt-6 md:mt-8 mb-4 md:mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                        <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-400">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-8 h-8 text-purple-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                Perfect For Everyone
              </h2>
              <p className="text-lg md:text-xl text-gray-400">
                Whether you&apos;re networking or building your brand
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  emoji: '🎯',
                  title: 'At Conferences',
                  description: 'Swap business cards instantly. No more fumbling with paper cards or typing contact info.',
                  gradient: 'from-purple-500/20 to-pink-500/20'
                },
                {
                  emoji: '💼',
                  title: 'For Freelancers',
                  description: 'Share your entire portfolio, social media, and contact info in one scan. Make it easy for clients to reach you.',
                  gradient: 'from-blue-500/20 to-cyan-500/20'
                },
                {
                  emoji: '🏢',
                  title: 'For Teams',
                  description: 'Create branded cards for your entire team. Consistent, professional, and always up-to-date.',
                  gradient: 'from-green-500/20 to-emerald-500/20'
                }
              ].map((useCase, i) => (
                <div
                  key={i}
                  className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className="text-5xl md:text-6xl mb-4 md:mb-6">{useCase.emoji}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-16 md:py-32 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-6 md:mb-8">
                Start free. Upgrade when you need more.
              </p>
              
              {/* Toggle */}
              <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`min-h-[44px] px-6 py-2 rounded-full transition-all ${
                    !isYearly ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`min-h-[44px] px-6 py-2 rounded-full transition-all ${
                    isYearly ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Free</h3>
                <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Perfect for getting started</p>
                
                <div className="mb-6 md:mb-8">
                  <span className="text-4xl md:text-5xl font-bold text-white">₹0</span>
                  <span className="text-gray-400 text-base md:text-lg">/forever</span>
                </div>
                
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {[
                    'Up to 5 social links',
                    'QR code generation',
                    'Custom username',
                    'Mobile responsive',
                    'Basic analytics'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 md:gap-3">
                      <Check className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/signup">
                  <Button variant="secondary" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-purple-400">
                {/* Animated glow */}
                <div 
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl md:rounded-3xl blur-xl opacity-50 animate-pulse"
                  style={{ animationDuration: '3s' }}
                ></div>
                
                <div className="relative">
                  <div className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-black px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-1.5 md:gap-2">
                      <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      Most Popular
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Pro</h3>
                  <p className="text-sm md:text-base text-purple-100 mb-4 md:mb-6">For professionals who want more</p>
                  
                  <div className="mb-6 md:mb-8">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      ₹{isYearly ? '119' : '149'}
                    </span>
                    <span className="text-purple-100 text-base md:text-lg">/month</span>
                    {isYearly && (
                      <div className="text-purple-200 text-xs md:text-sm mt-2">
                        Billed ₹1,428 yearly
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {[
                      'Unlimited links',
                      'Advanced analytics',
                      'Remove branding',
                      'Branded QR code',
                      'Custom themes & colors ::coming',
                      'Lead capture forms ::coming',
                      'Custom domain ::coming',
                      'Priority support'
                    ].map((feature, i) => {
                      const isComingSoon = feature.endsWith('::coming')
                      const label = feature.replace(' ::coming', '')
                      return (
                        <li key={i} className="flex items-start gap-2 md:gap-3">
                          <Check className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5 ${isComingSoon ? 'text-white/40' : 'text-white'}`} />
                          <span className={`text-sm md:text-base ${isComingSoon ? 'text-white/50' : 'text-white'}`}>
                            {label}
                            {isComingSoon && (
                              <span className="ml-1.5 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white/70">
                                Soon
                              </span>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  
                  <Link href="/pricing">
                    <Button variant="secondary" className="w-full bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
                      Upgrade to Pro
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/pricing" className="text-purple-400 hover:text-purple-300 font-medium">
                View detailed feature comparison →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-16 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Ready to transform your networking?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12">
              Join hundreds of professionals making meaningful connections
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
              Create Your Card — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-gray-500 text-sm mt-6">
              No credit card required • Setup in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Top: Logo + Links Row */}
          <div className="py-8 md:py-12 flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
            {/* Brand */}
            <div className="flex-1">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                Tappr
              </div>
              <p className="text-gray-500 text-sm max-w-xs">
                Your network, one tap away. Create your digital business card in seconds.
              </p>
            </div>
            
            {/* Links */}
            <div className="flex gap-12 md:gap-16">
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/pricing" className="text-gray-500 hover:text-white text-sm transition-colors">Pricing</Link></li>
                  <li><Link href="/signup" className="text-gray-500 hover:text-white text-sm transition-colors">Get Started</Link></li>
                  <li><Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors">Sign In</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/help" className="text-gray-500 hover:text-white text-sm transition-colors">Help & Support</Link></li>
                  <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-4 border-t border-white/5 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-xs">
              © 2026 Tappr. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/therajeshchityal" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://x.com/tappr_in" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/in/rajesh-chityal-2a7014" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

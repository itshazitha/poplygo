'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Animated poll data
  const [pollData, setPollData] = useState([
    { label: 'Very confident', value: 45 },
    { label: 'Somewhat confident', value: 70 },
    { label: 'Need more practice', value: 25 },
  ])

  // Questions pool for rotation
  const questionsPool = [
    { text: 'Can you explain supervised vs unsupervised learning?', author: 'Anonymous', votes: 12 },
    { text: 'Will slides be shared after class?', author: 'Hanna', votes: 7 },
    { text: 'What are the prerequisites for this course?', author: 'Sarah', votes: 15 },
    { text: 'How do I access the lab materials?', author: 'Anonymous', votes: 9 },
    { text: 'Can you recommend additional reading?', author: 'Mike', votes: 11 },
    { text: 'Will there be a review session before the exam?', author: 'Alex', votes: 18 },
    { text: 'How does gradient descent work?', author: 'Anonymous', votes: 14 },
    { text: 'What is the difference between AI and ML?', author: 'Jordan', votes: 8 },
  ]

  const [displayedQuestions, setDisplayedQuestions] = useState(questionsPool.slice(0, 2))
  const [responseCount, setResponseCount] = useState(32)

  // Animate poll percentages
  useEffect(() => {
    const pollInterval = setInterval(() => {
      setPollData(prev => prev.map(item => ({
        ...item,
        value: Math.max(15, Math.min(85, item.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)))
      })))
      
      // Update response count
      setResponseCount(prev => Math.max(25, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1))))
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [])

  // Rotate questions
  useEffect(() => {
    const questionInterval = setInterval(() => {
      setDisplayedQuestions(prev => {
        // Get random two questions that aren't currently displayed
        const availableQuestions = questionsPool.filter(
          q => !prev.some(p => p.text === q.text)
        )
        
        if (availableQuestions.length >= 2) {
          const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
          return shuffled.slice(0, 2)
        }
        
        return prev
      })
    }, 4000)

    return () => clearInterval(questionInterval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
     {/* Navigation - ENHANCED VERSION */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
  {/* Animated gradient line at top */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-gradient-x"></div>
  
  <div className="container-responsive">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <Link href="/" className="flex items-center py-4 group">
        <Logo height={48} />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <Link 
          href="/#how-it-works" 
          className="relative text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 group"
        >
          <span>How It Works</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link 
          href="/contact" 
          className="relative text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 group"
        >
          <span>Contact Us</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link 
          href="/#support" 
          className="relative text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 group"
        >
          <span>Support Us</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link 
          href="/join" 
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 group"
        >
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Join</span>
        </Link>
        <Link 
          href="/create" 
          className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Animated shine effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
          <svg className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative z-10">Create</span>
        </Link>
      </div>
    </div>
  </div>
</nav>


      {/* Hero Section - Reduced top padding */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-responsive relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Free Badge with Heartbeat Animation */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <svg className="w-5 h-5 animate-heartbeat" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Free Forever
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Interactive Sessions Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Simple</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Run anonymous Q&A, instant polls, and live feedback in seconds. No logins, no installs. Students join with a code, you get real-time insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/create" className="btn-primary text-center group">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Session
                  </span>
                </Link>
                <Link href="/join" className="btn-secondary text-center group">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Join Session
                  </span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Registration Required
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Works on Any Device
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completely Free
                </div>
              </div>
            </div>

            {/* Right Side - Animated Mock UI */}
            <div className="relative animate-fade-in animation-delay-1000">
              {/* Floating Elements - Behind the card and lower */}
              <div className="absolute top-6 -right-6 w-20 h-20 bg-purple-500 rounded-2xl opacity-20 animate-float -z-10"></div>
              <div className="absolute bottom-10 -left-6 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-float-slower -z-10"></div>

              {/* Session Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6 border border-gray-100 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">Live session</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Intro to Data Science</h3>
                  </div>
                  {/* More visible green dot */}
                  <div className="relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* Animated Poll Section */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-700">Live poll</span>
                    <span className="text-xs text-purple-600 font-medium transition-all duration-500">
                      {responseCount} responses
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">How confident do you feel with today's topic?</p>
                  <div className="space-y-2">
                    {pollData.map((option, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{option.label}</span>
                          <span className="font-semibold text-purple-600 transition-all duration-500">
                            {Math.round(option.value)}%
                          </span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${option.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated Questions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900">Recent Questions</h4>
                  <div className="space-y-2">
                    {displayedQuestions.map((q, i) => (
                      <div 
                        key={`${q.text}-${i}`} 
                        className="bg-gray-50 rounded-lg p-3 space-y-2 hover:bg-gray-100 transition-all duration-500 animate-fade-in"
                      >
                        <p className="text-sm text-gray-900 font-medium">{q.text}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{q.author}</span>
                          <span className="text-purple-600 font-semibold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {q.votes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
	  
	  
	  
{/* Features Section - ENHANCED VERSION */}
<section id="features" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
  </div>

  <div className="container-responsive relative z-10">
    <div className="text-center mb-16 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Feature-Rich Platform
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Everything You Need, Nothing You Don't
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Simple, powerful, and completely free tools to make your sessions more interactive.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
          title: 'Anonymous Q&A',
          description: 'Students ask questions without fear. Upvote the best ones. Track what matters most.',
          color: 'from-purple-500 to-purple-700',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          title: 'Instant Polls',
          description: 'Create polls in seconds. See results update live. Get instant feedback from your audience.',
          color: 'from-blue-500 to-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          title: 'Real-Time Updates',
          description: 'No refreshing needed. Questions and votes appear instantly for everyone.',
          color: 'from-yellow-500 to-orange-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
          title: 'Works Everywhere',
          description: 'No apps to download. Works on phones, tablets, and computers. Just share a code.',
          color: 'from-green-500 to-emerald-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          title: 'Private & Secure',
          description: 'Your sessions are private. Student data is never sold or shared. Ever.',
          color: 'from-red-500 to-pink-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        },
        {
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          ),
          title: 'Share Announcements',
          description: 'Push important updates to all participants instantly. Keep everyone on the same page.',
          color: 'from-indigo-500 to-purple-700',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
        },
      ].map((feature, i) => (
        <div
          key={i}
          className={`relative group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-2 ${feature.borderColor} hover:scale-105 hover:-translate-y-2`}
        >
          {/* Decorative corner accent */}
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full`}></div>
          
          <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            {feature.icon}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
            {feature.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>

          {/* Hover indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-16">
      <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900">100% Free Forever</p>
            <p className="text-sm text-gray-600">No credit card. No hidden fees.</p>
          </div>
        </div>
        <Link
          href="/create"
          className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
        >
          Try it now
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
</section>

{/* How It Works Section - ENHANCED VERSION */}
<section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-32 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
  </div>

  <div className="container-responsive relative z-10">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Quick Setup
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Start in 30 Seconds
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        No setup. No training. No complexity. Just fast, simple interaction.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
      {[
        {
          step: '1',
          title: 'Create Session',
          description: 'Click "Create Session" and give your session a name. Takes 5 seconds.',
          color: 'from-purple-500 to-purple-700',
          bgGradient: 'from-purple-100 to-purple-50',
        },
        {
          step: '2',
          title: 'Share Code',
          description: 'Students enter the code on their devices. No account needed.',
          color: 'from-blue-500 to-blue-700',
          bgGradient: 'from-blue-100 to-blue-50',
        },
        {
          step: '3',
          title: 'Engage & Learn',
          description: 'Questions flow in. Polls get answered. Everyone participates.',
          color: 'from-pink-500 to-pink-700',
          bgGradient: 'from-pink-100 to-pink-50',
        },
      ].map((step, i) => (
        <div key={i} className="relative group">
          {/* Connecting line (hidden on mobile, shown on md+) */}
          {i < 2 && (
            <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 z-0">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
          
          <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 group-hover:scale-105 group-hover:-translate-y-2">
            {/* Step number badge */}
            <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white text-2xl font-bold flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-300 border-4 border-white`}>
              {step.step}
            </div>

            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.bgGradient} opacity-50 rounded-bl-full`}></div>
            
            <div className="relative pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Checkmark indicator */}
              <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Action buttons */}
    <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/create" className="btn-primary inline-flex items-center justify-center gap-2 group shadow-xl hover:shadow-2xl">
        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Free Session
      </Link>
      <Link href="/join" className="btn-secondary inline-flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl">
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Join Session
      </Link>
    </div>

    {/* Need Help Link */}
    <div className="text-center mt-8">
      <Link 
        href="/help" 
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-all font-medium shadow-sm hover:shadow-md border border-gray-200"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span>Need help getting started?</span>
      </Link>
    </div>
  </div>
</section>


      {/* Support Section */}
      <section id="support" className="py-20 md:py-32 bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
                <svg className="w-5 h-5 animate-heartbeat" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Always Free
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Keep Poplyqo Free for Everyone
              </h2>
              <p className="text-lg text-gray-600">
                Poplyqo is 100% free with no limits. Running servers and maintaining the platform costs money. If you find value in what we do, consider buying us a coffee!
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 border-2 border-purple-200">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Your support helps us:</h3>
                  <ul className="space-y-2">
                    {[
                      'Keep servers running smoothly',
                      'Handle thousands of live sessions',
                      'Add new features you request',
                      'Stay completely free forever',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Why donate?</h3>
                  <p className="text-gray-700">
                    We believe education tools should be accessible to everyone. No paywalls, no premium tiers, no hidden costs. Your donations keep it that way.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Every contribution, big or small, makes a difference!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.patreon.com/cw/Dynarq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                  Buy Us a Coffee
                </a>
                
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Or just keep using Poplyqo for free. No pressure, ever. ❤️
              </p>
            </div>
          </div>
        </div>
      </section>

{/* Footer - UPDATED WITH CONTACT US PAGE LINK */}
<footer className="bg-gray-900 text-white py-12">
  <div className="container-responsive">
    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
      {/* Left Side */}
      <div className="space-y-5 md:max-w-md">
        <div className="flex items-center">
          <Logo height={40} />
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Free interactive session tools for educators and presenters.
        </p>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-gray-300">Quick Start</p>
              <p className="text-xs leading-relaxed">No signup needed. Create a session and share the code. Done.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-gray-300">Always Free</p>
              <p className="text-xs leading-relaxed">No limits. No premium tiers. Free forever for everyone.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-300">Need Help?</p>
              <a href="mailto:support@poplyqo.com" className="text-xs hover:text-purple-400 transition-colors">support@poplyqo.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
            <li><Link href="/create" className="text-gray-400 hover:text-white transition-colors">Create Session</Link></li>
            <li><Link href="/join" className="text-gray-400 hover:text-white transition-colors">Join Session</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="/#support" className="text-gray-400 hover:text-white transition-colors">Donate</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
          
          <h4 className="font-bold mt-6 mb-4">Connect</h4>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/dynarq" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all hover:scale-110" aria-label="LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://github.com/poplyqo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all hover:scale-110" aria-label="GitHub">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
      <p>
        Crafted with passion by{' '}
        <a 
          href="https://dynarq.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
        >
          Dynarq
        </a>
        {' '}to empower educators worldwide. Forever free.
      </p>
      <p className="mt-2">© {new Date().getFullYear()} Poplyqo. All rights reserved.</p>
    </div>
  </div>
</footer>


    </div>
  )
}

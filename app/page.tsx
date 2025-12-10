export const revalidate = 3600

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-4 border-purple-400 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 border-4 border-pink-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-indigo-400 rounded-full animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container-responsive py-6">
          <div className="flex items-center justify-between">
            <Logo height={40} />
            <div className="hidden sm:flex space-x-4">
              <Link href="/create" className="text-gray-600 hover:text-indigo-600 transition font-medium">
                Create
              </Link>
              <Link href="/join" className="text-gray-600 hover:text-indigo-600 transition font-medium">
                Join
              </Link>
            </div>
          </div>
        </nav>

        <main className="container-responsive">
          {/* Hero Section with Enhanced Visuals */}
          <section className="py-12 md:py-20 text-center animate-fade-in">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 border border-white/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-gray-700 font-medium">Live Q&A Platform</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect Classrooms<br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Engage Students
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Real-time Q&A sessions for educators. Anonymous questions, instant feedback,
              and popular topics rise to the top. No sign-up required.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/create"
                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                aria-label="Create a new classroom session"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Session</span>
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              
              <Link
                href="/join"
                className="group w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-900/10 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 hover:scale-105"
                aria-label="Join an existing session with code"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Join Session</span>
                </span>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-700">Free Forever</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-700">No Sign-Up</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-700">Secure & Private</span>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-12 md:py-20" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Educators Love Poplygo
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="card-enhanced animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Setup</h3>
                <p className="text-gray-600">
                  Create a session in 5 seconds. Share the code and students join immediately.
                  No accounts or downloads needed.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card-enhanced animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm" style={{animationDelay: '0.1s'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Anonymous Questions</h3>
                <p className="text-gray-600">
                  Students ask freely without fear. Get honest feedback and capture questions
                  shy students wouldn't normally ask.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card-enhanced animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm" style={{animationDelay: '0.2s'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Upvote System</h3>
                <p className="text-gray-600">
                  Students vote on questions they care about. Popular questions rise to the top
                  so you address what matters most.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="card-enhanced animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm" style={{animationDelay: '0.3s'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
                <p className="text-gray-600">
                  Questions appear instantly as students submit them. No manual refresh needed.
                  See engagement happen live.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="card-enhanced animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm" style={{animationDelay: '0.4s'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Mobile-First</h3>
                <p className="text-gray-600">
                  Works perfectly on phones, tablets, and desktops. Students use whatever
                  device they have at hand.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="card-enhanced animate-fade-in hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm" style={{animationDelay: '0.5s'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
                <p className="text-gray-600">
                  Sessions auto-delete after 24 hours. No data sold. Your classroom discussions
                  stay private.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12 md:py-20 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12" aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
              Get Started in 3 Simple Steps
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Create Session</h3>
                <p className="text-gray-600">
                  Click "Create Session", give it a name, and get your unique 6-digit code
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Share Code</h3>
                <p className="text-gray-600">
                  Display the code on your screen or share it with students via chat
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Engage Live</h3>
                <p className="text-gray-600">
                  Watch questions roll in real-time and address the most popular ones first
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Classroom?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of educators using Poplygo to boost student engagement
            </p>
            <Link
              href="/create"
              className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              aria-label="Start your first session now"
            >
              <span>Start Your First Session</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 mt-12 bg-white/40 backdrop-blur-sm">
          <div className="container-responsive">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="mb-4">
                  <Logo iconOnly={false} height={32} />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time Q&A platform for modern classrooms
                </p>
                <p className="text-xs text-gray-500">
                  A product of <a href="https://dynarq.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 hover:text-indigo-700">DYNARQ</a>
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/create" className="text-gray-600 hover:text-indigo-600 transition">Create Session</Link></li>
                  <li><Link href="/join" className="text-gray-600 hover:text-indigo-600 transition">Join Session</Link></li>
                  <li><Link href="/help" className="text-gray-600 hover:text-indigo-600 transition">Help Center</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://dynarq.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition">About DYNARQ</a></li>
                  <li><a href="mailto:support@dynarq.com" className="text-gray-600 hover:text-indigo-600 transition">Contact</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="text-gray-600 hover:text-indigo-600 transition">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-600 hover:text-indigo-600 transition">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                © 2025 <a href="https://dynarq.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 hover:text-indigo-600 transition">DYNARQ Software Solutions</a>. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.youtube.com/@dynarqai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-red-600 transition"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/dynarq" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-700 transition"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

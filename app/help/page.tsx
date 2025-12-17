'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [openIssueIndex, setOpenIssueIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I create a session?",
      answer: "Click the 'Create Session' button on the homepage, enter a title for your session, and you'll receive a unique 6-digit code to share with students."
    },
    {
      question: "Students can't join my session. What should I do?",
      answer: "Make sure the session is still active and the code is correct. Sessions automatically end after 24 hours of inactivity. If issues persist, create a new session."
    },
    {
      question: "Can students ask questions anonymously?",
      answer: "Yes! Students can leave the name field blank when submitting questions to remain anonymous. This encourages more participation."
    },
    {
      question: "How does the upvoting system work?",
      answer: "Students can upvote questions they find important. Each student can only upvote a question once. Questions with more upvotes appear at the top."
    },
    {
      question: "Do I need to create an account?",
      answer: "No! Poplygo works without any sign-up. Just create or join a session and start engaging immediately."
    },
    {
      question: "How long do sessions last?",
      answer: "Active sessions last indefinitely until you end them. Inactive sessions (not accessed for 24 hours) are automatically deleted to protect your privacy."
    },
    {
      question: "Can I see who asked which question?",
      answer: "Only if the student chose to include their name. Anonymous questions show 'Anonymous' as the author."
    },
    {
      question: "What happens to my data?",
      answer: "Your session data is stored securely and automatically deleted after 24 hours of inactivity. We never sell your data to third parties."
    },
    {
      question: "The page isn't updating. What should I do?",
      answer: "Questions refresh automatically every 3 seconds. If you're offline, check your internet connection. You can also click the refresh button manually."
    },
    {
      question: "I found a bug. How do I report it?",
      answer: "Click the feedback button in the bottom-right corner of any page. We appreciate your help in making Poplygo better!"
    }
  ]

  const knownIssues = [
    {
      issue: "Questions flash when refreshing",
      solution: "This is normal behavior as the system checks for new questions every 3 seconds. The flash only occurs if data has changed.",
      workaround: "None needed - this ensures you see questions in real-time."
    },
    {
      issue: "Can't upvote after already voting",
      solution: "Each student can only upvote a question once. This is tracked in your browser's local storage.",
      workaround: "Clear your browser's local storage if you need to test multiple votes (only for testing)."
    },
    {
      issue: "Offline warning appears",
      solution: "You've lost internet connection. Some features won't work until you reconnect.",
      workaround: "Check your WiFi or mobile data connection."
    }
  ]

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-responsive relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Help Center
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in animation-delay-200">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in animation-delay-400">
              Find answers to common questions and learn how to get the most out of Poplygo
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about using Poplygo</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transition-all hover:shadow-xl"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-purple-600 transition-transform flex-shrink-0 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openFaqIndex === index && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-purple-50/30">
                    <p className="text-gray-700 leading-relaxed pl-12">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Known Issues Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Known Issues</h2>
            <p className="text-lg text-gray-600">Common behaviors and how to handle them</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {knownIssues.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transition-all hover:shadow-xl"
              >
                <button
                  onClick={() => setOpenIssueIndex(openIssueIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{item.issue}</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-orange-600 transition-transform flex-shrink-0 ${
                      openIssueIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openIssueIndex === index && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-orange-50/30">
                    <div className="pl-12 space-y-3">
                      <div>
                        <p className="text-sm font-bold text-gray-700 mb-1">Solution:</p>
                        <p className="text-gray-700 leading-relaxed">{item.solution}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700 mb-1">Workaround:</p>
                        <p className="text-gray-700 leading-relaxed">{item.workaround}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl border-2 border-purple-200 p-8 md:p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Still need help?</h3>
              <p className="text-gray-600 text-lg mb-8">
                Can't find what you're looking for? Send us your feedback or questions.
              </p>
              <a
                href="mailto:support@poplyqo.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
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

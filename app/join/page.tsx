'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function JoinSession() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Session not found or has ended')
        } else {
          console.error('Supabase error:', error)
          toast.error('Failed to join session. Please try again.')
        }
        setLoading(false)
        return
      }

      if (!data) {
        toast.error('Invalid session code')
        setLoading(false)
        return
      }

      toast.success('Joining session...')
      router.push(`/session/${code}`)
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong. Please check your connection.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <nav className="container-responsive py-6">
          <Link href="/" className="flex items-center space-x-2 w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Poplygo
            </span>
          </Link>
        </nav>

        {/* Main Content */}
        <div className="flex items-center justify-center px-4 py-12 md:py-20">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Session</h1>
                <p className="text-gray-600">Enter the code to get started</p>
              </div>
              
              <form onSubmit={handleJoin} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-semibold mb-3 text-gray-700 text-center">
                    Session Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={loading}
                    className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-center text-4xl font-mono font-bold tracking-[0.5em] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 bg-white/50"
                    style={{letterSpacing: '0.5em'}}
                  />
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          i < code.length ? 'bg-indigo-600 scale-125' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Enter the 6-digit code from your instructor
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    'Join Session'
                  )}
                </button>

                <Link
                  href="/"
                  className="block text-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Home
                </Link>
              </form>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 grid gap-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">No account needed.</span> Join anonymously and start asking questions!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

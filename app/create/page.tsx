'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CreateSession() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [authRequired, setAuthRequired] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a session title')
      return
    }

    if (title.trim().length < 3) {
      toast.error('Title must be at least 3 characters')
      return
    }

    if (title.length > 100) {
      toast.error('Title must be less than 100 characters')
      return
    }

    setLoading(true)

    try {
      const code = generateCode()
      
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          {
            code,
            title: title.trim(),
            auth_required: authRequired,
            active: true
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        toast.error('Failed to create session. Please try again.')
        return
      }

      if (!data || data.length === 0) {
        toast.error('Session created but no data returned')
        return
      }

      toast.success('Session created successfully!')
      router.push(`/session/${code}/host`)
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong. Please check your connection.')
    } finally {
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Session</h1>
                <p className="text-gray-600">Start your Q&A session in seconds</p>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-700">
                    Session Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to React"
                    maxLength={100}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 bg-white/50"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                    <span>Min 3 characters</span>
                    <span className={title.length > 90 ? 'text-orange-500 font-semibold' : ''}>
                      {title.length}/100
                    </span>
                  </p>
                </div>

                <div className="flex items-start space-x-3 bg-gray-50/50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="auth"
                    checked={authRequired}
                    onChange={(e) => setAuthRequired(e.target.checked)}
                    disabled={loading}
                    className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label htmlFor="auth" className="text-sm text-gray-700 flex-1">
                    <span className="font-semibold block mb-1">Require authentication</span>
                    <span className="text-gray-500">Students will need to sign in before joining</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Session...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Session</span>
                    </span>
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

            {/* Info Box */}
            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-700 mb-1">What happens next?</p>
                  <p>You'll get a unique 6-digit code to share with students. They can join instantly without any sign-up!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

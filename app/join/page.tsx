'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Join Session</h1>
        
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-2 text-center">
              Enter Session Code
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
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-3xl font-mono tracking-widest disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {code.length}/6 digits
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg font-semibold"
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

          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={loading}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  )
}

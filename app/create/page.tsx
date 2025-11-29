'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

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
    
    // Validation
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Create New Session</h1>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auth"
              checked={authRequired}
              onChange={(e) => setAuthRequired(e.target.checked)}
              disabled={loading}
              className="rounded"
            />
            <label htmlFor="auth" className="text-sm">
              Require authentication
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Session'
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={loading}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

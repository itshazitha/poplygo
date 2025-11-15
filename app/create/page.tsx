'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
    setLoading(true)

    try {
      const code = generateCode()
      
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          {
            code,
            title,
            auth_required: authRequired,
            active: true
          }
        ])
        .select()

      if (error) throw error

      router.push(`/session/${code}/host`)
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session')
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
              Session Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auth"
              checked={authRequired}
              onChange={(e) => setAuthRequired(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="auth" className="text-sm">
              Require authentication
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </form>
      </div>
    </div>
  )
}

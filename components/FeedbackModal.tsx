'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<'bug' | 'feature' | 'other'>('bug')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast.error('Please describe your feedback')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            type,
            message: message.trim(),
            email: email.trim() || null,
            page: window.location.pathname,
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      toast.success('Thank you for your feedback!')
      setMessage('')
      setEmail('')
      setType('bug')
      onClose()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Send Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close feedback modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Feedback Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType('bug')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  type === 'bug'
                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300'
                }`}
              >
                🐛 Bug
              </button>
              <button
                type="button"
                onClick={() => setType('feature')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  type === 'feature'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300'
                }`}
              >
                💡 Feature
              </button>
              <button
                type="button"
                onClick={() => setType('other')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  type === 'other'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300'
                }`}
              >
                💬 Other
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue or suggestion..."
              required
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{message.length}/1000</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
              Email (optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">We'll only use this to follow up on your feedback</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

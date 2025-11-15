'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question } from '@/types'

export default function StudentSession() {
  const params = useParams()
  const code = params.code as string
  
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSession()
    fetchQuestions()
    
    const interval = setInterval(fetchQuestions, 3000)
    return () => clearInterval(interval)
  }, [code])

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .single()

      if (error) throw error
      setSession(data)
    } catch (error) {
      console.error('Error fetching session:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      const sessionData = await supabase
        .from('sessions')
        .select('id')
        .eq('code', code)
        .single()

      if (sessionData.data) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('session_id', sessionData.data.id)
          .order('upvotes', { ascending: false })

        if (error) throw error
        setQuestions(data || [])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sessionData = await supabase
        .from('sessions')
        .select('id')
        .eq('code', code)
        .single()

      if (!sessionData.data) throw new Error('Session not found')

      const { error } = await supabase
        .from('questions')
        .insert([
          {
            session_id: sessionData.data.id,
            content: newQuestion,
            author_name: authorName || 'Anonymous',
            upvotes: 0
          }
        ])

      if (error) throw error

      setNewQuestion('')
      fetchQuestions()
    } catch (error) {
      console.error('Error submitting question:', error)
      alert('Failed to submit question')
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async (questionId: string, currentUpvotes: number) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', questionId)

      if (error) throw error
      fetchQuestions()
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
          <p className="text-gray-600">Session Code: {code}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Submit a Question</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Anonymous"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium mb-2">
                Your Question
              </label>
              <textarea
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">All Questions ({questions.length})</h2>
          
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No questions yet</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-lg mb-2">{question.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {question.author_name}
                    </span>
                    <button
                      onClick={() => handleUpvote(question.id, question.upvotes)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm font-medium"
                    >
                      ▲ {question.upvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

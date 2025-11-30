'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question } from '@/types'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import QuestionSkeleton from '@/components/QuestionSkeleton'

export default function HostDashboard() {
  const params = useParams()
  const code = params.code as string
  
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchSession()
    fetchQuestions()
    
    // Add auto-refresh every 3 seconds
    const interval = setInterval(fetchQuestions, 3000)
    return () => clearInterval(interval)
  }, [code])

  // Reset to page 1 when questions change
  useEffect(() => {
    setCurrentPage(1)
  }, [questions.length])

  // Paginate questions
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return questions.slice(startIndex, endIndex)
  }, [questions, currentPage])

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
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async () => {
    setQuestionsLoading(true)
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
          .eq('deleted', false)
          .order('upvotes', { ascending: false })

        if (error) throw error
        setQuestions(data || [])
      }
      setQuestionsLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestionsLoading(false)
    }
  }

  const endSession = async () => {
    if (!confirm('Are you sure you want to end this session? This cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('sessions')
        .update({ active: false })
        .eq('code', code)

      if (error) {
        console.error('Error ending session:', error)
        toast.error('Failed to end session. Please try again.')
        return
      }

      toast.success('Session ended successfully!')
      
      // Refresh session data to show updated state
      fetchSession()
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Session not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Session Code</p>
              <p className="text-4xl font-bold text-blue-600">{code}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={endSession}
                disabled={!session.active}
                className={`px-4 py-2 rounded-md transition ${
                  session.active
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {session.active ? 'End Session' : 'Session Ended'}
              </button>
              {!session.active && (
                <span className="text-sm text-gray-500">This session is inactive</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Questions ({questions.length})</h2>
          
          {questionsLoading ? (
            <div className="space-y-4">
              <QuestionSkeleton />
              <QuestionSkeleton />
              <QuestionSkeleton />
            </div>
          ) : questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No questions yet. Students can join using the code above.
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedQuestions.map((question) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-lg">{question.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        {question.author_name || 'Anonymous'}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {question.upvotes} upvotes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalItems={questions.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

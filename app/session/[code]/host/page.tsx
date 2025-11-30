'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question } from '@/types'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import QuestionSkeleton from '@/components/QuestionSkeleton'
import Link from 'next/link'

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
    
    const interval = setInterval(fetchQuestions, 3000)
    return () => clearInterval(interval)
  }, [code])

  useEffect(() => {
    setCurrentPage(1)
  }, [questions.length])

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
      fetchSession()
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Session not found</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
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

        <div className="container-responsive py-8">
          {/* Session Info Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border border-white/20 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{session.title}</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Session Code:</span>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-mono text-3xl font-bold tracking-wider shadow-lg">
                    {code}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Share this code with your students</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={endSession}
                  disabled={!session.active}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    session.active
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {session.active ? 'End Session' : 'Session Ended'}
                </button>
                {!session.active && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    This session is inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <span>Questions</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full">
                  {questions.length}
                </span>
              </h2>
              {questions.length > 0 && (
                <button
                  onClick={fetchQuestions}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              )}
            </div>
            
            {questionsLoading ? (
              <div className="space-y-4">
                <QuestionSkeleton />
                <QuestionSkeleton />
                <QuestionSkeleton />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">No questions yet</p>
                <p className="text-gray-400 text-sm">Students can join using the code above and start asking questions</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 animate-fade-in"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <p className="text-lg text-gray-900 mb-3 leading-relaxed">{question.content}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{question.author_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span className="font-semibold text-indigo-600">{question.upvotes}</span>
                        </div>
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
    </div>
  )
}

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question } from '@/types'
import toast from 'react-hot-toast'
import { withRetry, isNetworkError } from '@/lib/retry'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import Pagination from '@/components/Pagination'
import QuestionSkeleton from '@/components/QuestionSkeleton'
import Link from 'next/link'

export default function StudentSession() {
  const params = useParams()
  const code = params.code as string
  const isOnline = useOnlineStatus()
  
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
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
    }
  }

const fetchQuestions = async () => {
  // Only show loading on initial fetch
  if (questions.length === 0) {
    setQuestionsLoading(true)
  }
  
  try {
    await withRetry(async () => {
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
        
        // Only update if data actually changed
        const newData = data || []
        const hasChanged = JSON.stringify(newData) !== JSON.stringify(questions)
        
        if (hasChanged) {
          setQuestions(newData)
        }
      }
      setQuestionsLoading(false)
    }, {
      maxRetries: 2,
      onRetry: (attempt) => {
        console.log(`Retrying fetch questions (attempt ${attempt})`)
      }
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    setQuestionsLoading(false)
    if (isNetworkError(error)) {
      toast.error('Connection issue. Retrying...')
    }
  }
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newQuestion.trim()) {
      toast.error('Please enter a question')
      return
    }

    if (newQuestion.length > 500) {
      toast.error('Question must be less than 500 characters')
      return
    }

    setLoading(true)

    try {
      await withRetry(async () => {
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
              content: newQuestion.trim(),
              author_name: authorName.trim() || 'Anonymous',
              upvotes: 0
            }
          ])

        if (error) throw error
      }, {
        maxRetries: 2,
        onRetry: (attempt) => {
          toast.loading(`Retrying... (attempt ${attempt})`)
        }
      })

      toast.success('Question submitted!')
      setNewQuestion('')
      fetchQuestions()
    } catch (error) {
      console.error('Error submitting question:', error)
      toast.error('Failed to submit question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async (questionId: string, currentUpvotes: number) => {
    const upvotedQuestions = JSON.parse(
      localStorage.getItem('upvoted_questions') || '[]'
    )

    if (upvotedQuestions.includes(questionId)) {
      toast.error('You already upvoted this question')
      return
    }

    try {
      const { error } = await supabase
        .from('questions')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', questionId)

      if (error) throw error

      upvotedQuestions.push(questionId)
      localStorage.setItem('upvoted_questions', JSON.stringify(upvotedQuestions))

      toast.success('Question upvoted!')
      fetchQuestions()
    } catch (error) {
      console.error('Error upvoting:', error)
      toast.error('Failed to upvote question')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
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
          {/* Offline Warning */}
          {!isOnline && (
            <div className="mb-6 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-6 py-4 rounded-xl flex items-center space-x-3 animate-fade-in">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">You are offline</p>
                <p className="text-sm">Some features may not work until you reconnect</p>
              </div>
            </div>
          )}

          {/* Session Info */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 mb-6 border border-white/20 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Session Code:</span>
                  <span className="font-mono font-bold text-indigo-600">{code}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-700">Live</span>
              </div>
            </div>
          </div>

          {/* Submit Question Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Submit a Question</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                  Your Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Leave blank to stay anonymous"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/50"
                />
              </div>

              <div>
                <label htmlFor="question" className="block text-sm font-semibold mb-2 text-gray-700">
                  Your Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What would you like to ask?"
                  required
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 resize-none bg-white/50"
                />
                <p className={`text-xs mt-2 flex items-center justify-between ${newQuestion.length > 450 ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>
                  <span>Express your thoughts clearly</span>
                  <span>{newQuestion.length}/500</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isOnline || !newQuestion.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Submit Question</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Questions List */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
              <span className="flex items-center space-x-3">
                <span>All Questions</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full">
                  {questions.length}
                </span>
              </span>
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
            </h2>
            
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
                <p className="text-gray-400 text-sm">Be the first to ask something!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedQuestions.map((question, index) => {
                    const upvotedQuestions = JSON.parse(
                      localStorage.getItem('upvoted_questions') || '[]'
                    )
                    const hasUpvoted = upvotedQuestions.includes(question.id)
                    
                    return (
                      <div
                        key={question.id}
                        className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 animate-fade-in"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <p className="text-lg text-gray-900 mb-3 leading-relaxed">{question.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{question.author_name}</span>
                          </div>
                          <button
                            onClick={() => handleUpvote(question.id, question.upvotes)}
                            disabled={hasUpvoted || !isOnline}
                            className={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                              hasUpvoted || !isOnline
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            <svg className={`w-5 h-5 ${!hasUpvoted && isOnline ? 'group-hover:scale-125 transition-transform' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span>{question.upvotes}</span>
                            {hasUpvoted && <span className="text-xs">(Voted)</span>}
                          </button>
                        </div>
                      </div>
                    )
                  })}
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

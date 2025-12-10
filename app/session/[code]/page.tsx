'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Logo from '@/components/Logo'

type Poll = {
  id: string
  session_id: string
  question: string
  allow_multiple_votes: boolean
  max_votes: number
  active: boolean
  show_results_to_students: boolean
  correct_answer_id: string | null
  created_at: string
}

type PollOption = {
  id: string
  poll_id: string
  option_text: string
  vote_count: number
  created_at: string
}

type PollWithOptions = Poll & { options: PollOption[] }

type Vote = {
  poll_id: string
  option_ids: string[]
}

export default function StudentSession() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [polls, setPolls] = useState<PollWithOptions[]>([])
  const [myVotes, setMyVotes] = useState<Vote[]>([])
  const [upvotedQuestions, setUpvotedQuestions] = useState<string[]>([])
  
  // UI state
  const [activeTab, setActiveTab] = useState<'questions' | 'polls'>('questions')
  const [submitQuestionExpanded, setSubmitQuestionExpanded] = useState(false)
  const [questionFilter, setQuestionFilter] = useState<'all' | 'newest' | 'popular' | 'answered'>('all')
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [tempName, setTempName] = useState('')
  
  // Submit question state
  const [newQuestion, setNewQuestion] = useState('')
  const [authorName, setAuthorName] = useState('Anonymous')
  const [submitting, setSubmitting] = useState(false)

  const loadLocalData = () => {
    const savedVotes = localStorage.getItem(`poplygo_votes_${code}`)
    const savedUpvotes = localStorage.getItem(`poplygo_upvotes_${code}`)

    if (savedVotes) {
      try {
        setMyVotes(JSON.parse(savedVotes))
      } catch (e) {
        console.error('Error loading votes:', e)
      }
    }

    if (savedUpvotes) {
      try {
        setUpvotedQuestions(JSON.parse(savedUpvotes))
      } catch (e) {
        console.error('Error loading upvotes:', e)
      }
    }
  }

  const saveVotes = (votes: Vote[]) => {
    localStorage.setItem(`poplygo_votes_${code}`, JSON.stringify(votes))
    setMyVotes(votes)
  }

  const saveUpvotes = (upvotes: string[]) => {
    localStorage.setItem(`poplygo_upvotes_${code}`, JSON.stringify(upvotes))
    setUpvotedQuestions(upvotes)
  }

  const handleSaveName = () => {
    const name = tempName.trim() || 'Anonymous'
    setAuthorName(name)
    localStorage.setItem(`poplygo_student_name_${code}`, name)
    setShowWelcomeModal(false)
    toast.success(`Welcome, ${name}!`)
  }

  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .single()
      
      if (error) throw error
      
      if (!data.active) {
        toast.error('This session has ended')
        router.push('/')
        return
      }
      
      setSession(prevSession => {
        if (!prevSession) return data
        if (prevSession.announcement !== data.announcement || 
            prevSession.qa_enabled !== data.qa_enabled ||
            prevSession.active !== data.active) {
          return data
        }
        return prevSession
      })
    } catch (error) {
      console.error('Error fetching session:', error)
      toast.error('Session not found')
      router.push('/')
    }
  }, [code, router])

  const fetchQuestions = useCallback(async () => {
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
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }, [code])

  const fetchPolls = useCallback(async () => {
    try {
      const sessionData = await supabase
        .from('sessions')
        .select('id')
        .eq('code', code)
        .single()

      if (!sessionData.data) return

      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('session_id', sessionData.data.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (pollsError) throw pollsError

      const pollIds = (pollsData || []).map((p) => p.id)
      if (pollIds.length === 0) {
        setPolls([])
        return
      }

      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('*')
        .in('poll_id', pollIds)
        .order('created_at', { ascending: true })

      if (optionsError) throw optionsError

      const optionsByPoll: Record<string, PollOption[]> = {}
      ;(optionsData || []).forEach((opt) => {
        if (!optionsByPoll[opt.poll_id]) optionsByPoll[opt.poll_id] = []
        optionsByPoll[opt.poll_id].push(opt)
      })

      const combined: PollWithOptions[] = (pollsData || []).map((p) => ({
        ...p,
        options: optionsByPoll[p.id] || [],
      }))

      setPolls(combined)
    } catch (error) {
      console.error('Error fetching polls:', error)
    }
  }, [code])

  useEffect(() => {
    const savedName = localStorage.getItem(`poplygo_student_name_${code}`)
    
    if (!savedName) {
      setShowWelcomeModal(true)
    } else {
      setAuthorName(savedName)
    }
    
    fetchSession()
    fetchQuestions()
    fetchPolls()
    loadLocalData()

    const dataInterval = setInterval(() => {
      fetchQuestions()
      fetchPolls()
    }, 3000)

    const sessionInterval = setInterval(() => {
      fetchSession()
    }, 10000)

    return () => {
      clearInterval(dataInterval)
      clearInterval(sessionInterval)
    }
  }, [code, fetchSession, fetchQuestions, fetchPolls])

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.qa_enabled) {
      toast.error('Questions are currently disabled by the host')
      return
    }

    if (!newQuestion.trim()) {
      toast.error('Please enter a question')
      return
    }

    setSubmitting(true)

    try {
      const sessionData = await supabase
        .from('sessions')
        .select('id')
        .eq('code', code)
        .single()

      if (!sessionData.data) throw new Error('Session not found')

      const { error } = await supabase
        .from('questions')
        .insert([{
          session_id: sessionData.data.id,
          content: newQuestion.trim(),
          author_name: authorName,
          upvotes: 0,
          answered: false,
          starred: false,
          deleted: false,
        }])

      if (error) throw error

      toast.success('Question submitted!')
      setNewQuestion('')
      setSubmitQuestionExpanded(false)
      fetchQuestions()
    } catch (error) {
      console.error('Error submitting question:', error)
      toast.error('Failed to submit question')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvote = async (questionId: string, currentUpvotes: number) => {
    const hasUpvoted = upvotedQuestions.includes(questionId)

    try {
      const newUpvotes = hasUpvoted ? currentUpvotes - 1 : currentUpvotes + 1

      const { error } = await supabase
        .from('questions')
        .update({ upvotes: newUpvotes })
        .eq('id', questionId)

      if (error) throw error

      const newUpvotedList = hasUpvoted
        ? upvotedQuestions.filter(id => id !== questionId)
        : [...upvotedQuestions, questionId]

      saveUpvotes(newUpvotedList)
      fetchQuestions()
    } catch (error) {
      console.error('Error upvoting:', error)
      toast.error('Failed to upvote')
    }
  }

  const handleVote = async (pollId: string, optionId: string, allowMultiple: boolean, maxVotes: number) => {
    const existingVote = myVotes.find(v => v.poll_id === pollId)
    
    if (!allowMultiple) {
      if (existingVote) {
        toast.error('You have already voted on this poll')
        return
      }
    } else {
      if (existingVote && existingVote.option_ids.length >= maxVotes && !existingVote.option_ids.includes(optionId)) {
        toast.error(`You can only select up to ${maxVotes} options`)
        return
      }
    }

    try {
      const poll = polls.find(p => p.id === pollId)
      if (!poll) return

      let newOptionIds: string[] = []
      
      if (allowMultiple && existingVote) {
        if (existingVote.option_ids.includes(optionId)) {
          newOptionIds = existingVote.option_ids.filter(id => id !== optionId)
          
          const option = poll.options.find(o => o.id === optionId)
          if (option && option.vote_count > 0) {
            const { error } = await supabase
              .from('poll_options')
              .update({ vote_count: option.vote_count - 1 })
              .eq('id', optionId)

            if (error) throw error
          }
        } else {
          newOptionIds = [...existingVote.option_ids, optionId]
          
          const { error } = await supabase.rpc('increment_poll_option_votes', {
            option_id_input: optionId
          })

          if (error) throw error
        }
      } else {
        newOptionIds = [optionId]
        
        const { error } = await supabase.rpc('increment_poll_option_votes', {
          option_id_input: optionId
        })

        if (error) throw error
      }

      const newVotes = existingVote
        ? myVotes.map(v => v.poll_id === pollId ? { poll_id: pollId, option_ids: newOptionIds } : v)
        : [...myVotes, { poll_id: pollId, option_ids: newOptionIds }]

      saveVotes(newVotes)
      toast.success('Vote recorded!')
      fetchPolls()
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to vote')
    }
  }

  const filteredQuestions = questions.filter(q => {
    if (questionFilter === 'answered') return q.answered
    if (questionFilter === 'newest') return true
    if (questionFilter === 'popular') return q.upvotes > 0
    return true
  }).sort((a, b) => {
    if (questionFilter === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (questionFilter === 'popular') return b.upvotes - a.upvotes
    return b.upvotes - a.upvotes
  })

  const qaEnabled = session?.qa_enabled ?? true

  if (!session && !showWelcomeModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 pb-24">
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Logo height={40} />
            </Link>

            <div className="flex items-center space-x-3">
              {session && <h1 className="text-lg font-bold text-foreground hidden md:block">{session.title}</h1>}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-8 space-y-6">
        {session && session.announcement && session.announcement.trim() && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-900 mb-1">Announcement</h3>
                <p className="text-sm text-blue-900 whitespace-pre-wrap">{session.announcement}</p>
              </div>
            </div>
          </div>
        )}

        {!qaEnabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-yellow-900">
                Questions are currently disabled by the host
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'questions'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-purple-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Questions</span>
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'polls'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-purple-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Polls</span>
            </button>
          </div>
        </div>

        {activeTab === 'questions' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`bg-white/80 backdrop-blur-md rounded-xl shadow-lg border overflow-hidden ${
              qaEnabled ? 'border-purple-100' : 'border-gray-200 opacity-60'
            }`}>
              <button
                onClick={() => {
                  if (!qaEnabled) {
                    toast.error('Questions are currently disabled')
                    return
                  }
                  setSubmitQuestionExpanded(!submitQuestionExpanded)
                }}
                disabled={!qaEnabled}
                className={`w-full flex items-center justify-between p-5 transition-colors ${
                  qaEnabled ? 'hover:bg-purple-50/50' : 'cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
                    qaEnabled ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gray-400'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-foreground">Submit a Question</h2>
                    <p className="text-sm text-muted-foreground">
                      {qaEnabled ? 'Ask anything to the host' : 'Questions are disabled'}
                    </p>
                  </div>
                </div>
                {qaEnabled && (
                  <svg 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${submitQuestionExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {submitQuestionExpanded && qaEnabled && (
                <form onSubmit={handleSubmitQuestion} className="p-5 border-t space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="What would you like to ask?"
                      required
                      rows={3}
                      maxLength={500}
                      className="input-enhanced resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2 flex justify-between">
                      <span>Posting as {authorName}</span>
                      <span className={newQuestion.length > 450 ? 'text-yellow-600' : ''}>
                        {newQuestion.length}/500
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSubmitQuestionExpanded(false)}
                      className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !newQuestion.trim()}
                      className="btn-primary"
                    >
                      {submitting ? 'Submitting...' : 'Submit Question'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-4">
              <div className="flex space-x-2">
                {(['all', 'newest', 'popular', 'answered'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setQuestionFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      questionFilter === filter
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-muted-foreground hover:bg-purple-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">No questions yet</p>
                <p className="text-sm text-muted-foreground">
                  {qaEnabled ? 'Be the first to ask a question!' : 'Questions are currently disabled'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((question) => {
                  const hasUpvoted = upvotedQuestions.includes(question.id)

                  return (
                    <div
                      key={question.id}
                      className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-5 hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleUpvote(question.id, question.upvotes)}
                          className={`flex flex-col items-center min-w-[44px] p-2 rounded-lg transition-all ${
                            hasUpvoted
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-50 text-gray-600 hover:bg-purple-50'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold mt-1">{question.upvotes}</span>
                        </button>

                        <div className="flex-1">
                          <p className="text-base text-foreground mb-3 leading-relaxed font-medium">
                            {question.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{question.author_name}</span>
                            {question.answered && (
                              <span className="flex items-center space-x-1 text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Answered</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="space-y-6 animate-fade-in">
            {polls.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">No active polls</p>
                <p className="text-sm text-muted-foreground">
                  The host hasn't created any polls yet
                </p>
              </div>
            ) : (
              polls.map((poll) => {
                const existingVote = myVotes.find(v => v.poll_id === poll.id)
                const hasVoted = !!existingVote
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0)

                return (
                  <div key={poll.id} className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">{poll.question}</h3>

                    {!hasVoted ? (
                      <div className="space-y-3">
                        {poll.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleVote(poll.id, option.id, poll.allow_multiple_votes, poll.max_votes)}
                            className="w-full text-left px-4 py-3 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                          >
                            <span className="font-medium text-foreground">{option.option_text}</span>
                          </button>
                        ))}
                        <p className="text-sm text-muted-foreground mt-4">
                          {poll.allow_multiple_votes 
                            ? `Select up to ${poll.max_votes} option${poll.max_votes > 1 ? 's' : ''}`
                            : 'Select one option'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {poll.show_results_to_students ? (
                          poll.options.map((option) => {
                            const percentage = totalVotes === 0 ? 0 : Math.round((option.vote_count / totalVotes) * 100)
                            const voted = existingVote.option_ids.includes(option.id)
                            const isCorrect = poll.correct_answer_id === option.id

                            return (
                              <div key={option.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 flex-1">
                                    <span className="font-medium text-foreground">{option.option_text}</span>
                                    {voted && (
                                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                                        Your vote
                                      </span>
                                    )}
                                    {isCorrect && (
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm font-semibold text-purple-600">
                                    {percentage}% ({option.vote_count})
                                  </span>
                                </div>
                                <div className="w-full bg-purple-100 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-lg font-semibold text-foreground mb-2">Vote recorded!</p>
                            <p className="text-sm text-muted-foreground">
                              Results will be shown by the host
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>

      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to the Session!</h2>
              <p className="text-muted-foreground">Enter your name to get started</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name (optional)"
                  className="input-enhanced"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveName()
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave blank to join as Anonymous
                </p>
              </div>

              <button
                onClick={handleSaveName}
                className="w-full btn-primary"
              >
                Join Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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

export default function HostSession() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [polls, setPolls] = useState<PollWithOptions[]>([])
  const [qaEnabled, setQaEnabled] = useState(true)
  
  // UI state
  const [activeTab, setActiveTab] = useState<'questions' | 'polls'>('questions')
  const [createPollExpanded, setCreatePollExpanded] = useState(false)
  const [activePollsExpanded, setActivePollsExpanded] = useState(true)
  const [questionFilter, setQuestionFilter] = useState<'all' | 'newest' | 'popular' | 'answered'>('all')
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  
  // Create poll state
  const [newPollQuestion, setNewPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [maxVotes, setMaxVotes] = useState(1)
  const [showResultsToStudents, setShowResultsToStudents] = useState(true)
  const [creatingPoll, setCreatingPoll] = useState(false)

  // Announcement state
  const [announcement, setAnnouncement] = useState('')
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false)

  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .single()
      
      if (error) throw error
      
      setSession(prevSession => {
        if (!prevSession) {
          setQaEnabled(data.qa_enabled ?? true)
          setAnnouncement(data.announcement || '')
          return data
        }
        
        // Only update if something changed
        if (prevSession.qa_enabled !== data.qa_enabled) {
          setQaEnabled(data.qa_enabled ?? true)
        }
        if (prevSession.announcement !== data.announcement && !showAnnouncementModal) {
          setAnnouncement(data.announcement || '')
        }
        
        return data
      })
    } catch (error) {
      console.error('Error fetching session:', error)
      toast.error('Failed to load session')
    }
  }, [code, showAnnouncementModal])

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
    fetchSession()
    fetchQuestions()
    fetchPolls()

    // Fetch questions and polls frequently
    const dataInterval = setInterval(() => {
      fetchQuestions()
      fetchPolls()
    }, 3000)

    // Fetch session data less frequently and NOT when modal is open
    const sessionInterval = setInterval(() => {
      if (!showAnnouncementModal && !createPollExpanded) {
        fetchSession()
      }
    }, 10000)

    return () => {
      clearInterval(dataInterval)
      clearInterval(sessionInterval)
    }
  }, [code, showAnnouncementModal, createPollExpanded, fetchSession, fetchQuestions, fetchPolls])

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPollQuestion.trim()) {
      toast.error('Please enter a poll question')
      return
    }

    const validOptions = pollOptions.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options')
      return
    }

    setCreatingPoll(true)

    try {
      const sessionData = await supabase
        .from('sessions')
        .select('id')
        .eq('code', code)
        .single()

      if (!sessionData.data) throw new Error('Session not found')

      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert([{
          session_id: sessionData.data.id,
          question: newPollQuestion.trim(),
          allow_multiple_votes: allowMultipleVotes,
          max_votes: allowMultipleVotes ? maxVotes : 1,
          active: true,
          show_results_to_students: showResultsToStudents,
        }])
        .select()
        .single()

      if (pollError) throw pollError

      const optionsToInsert = validOptions.map(opt => ({
        poll_id: pollData.id,
        option_text: opt.trim(),
        vote_count: 0,
      }))

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert)

      if (optionsError) throw optionsError

      toast.success('Poll created successfully!')
      setNewPollQuestion('')
      setPollOptions(['', ''])
      setAllowMultipleVotes(false)
      setMaxVotes(1)
      setShowResultsToStudents(true)
      setCreatePollExpanded(false)
      fetchPolls()
      setActiveTab('polls')
    } catch (error) {
      console.error('Error creating poll:', error)
      toast.error('Failed to create poll')
    } finally {
      setCreatingPoll(false)
    }
  }

  const handleEndSession = async () => {
    if (!confirm('Are you sure you want to end this session?')) return

    try {
      const { error } = await supabase
        .from('sessions')
        .update({ active: false })
        .eq('code', code)

      if (error) throw error

      toast.success('Session ended')
      router.push('/')
    } catch (error) {
      console.error('Error ending session:', error)
      toast.error('Failed to end session')
    }
  }

  const handleToggleQA = async () => {
    try {
      const newQaState = !qaEnabled

      const { error } = await supabase
        .from('sessions')
        .update({ qa_enabled: newQaState })
        .eq('code', code)

      if (error) throw error

      setQaEnabled(newQaState)
      toast.success(newQaState ? 'Q&A enabled' : 'Q&A disabled')
    } catch (error) {
      console.error('Error toggling QA:', error)
      toast.error('Failed to toggle Q&A')
    }
  }

  const handleSaveAnnouncement = async () => {
    setSendingAnnouncement(true)
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ announcement: announcement.trim() })
        .eq('code', code)

      if (error) throw error

      toast.success('Announcement saved!')
      setShowAnnouncementModal(false)
      fetchSession()
    } catch (error) {
      console.error('Error saving announcement:', error)
      toast.error('Failed to save announcement')
    } finally {
      setSendingAnnouncement(false)
    }
  }

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll?')) return

    try {
      const { error } = await supabase
        .from('polls')
        .update({ active: false })
        .eq('id', pollId)

      if (error) throw error

      toast.success('Poll deleted')
      fetchPolls()
    } catch (error) {
      console.error('Error deleting poll:', error)
      toast.error('Failed to delete poll')
    }
  }

  const handleToggleResultsVisibility = async (pollId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('polls')
        .update({ show_results_to_students: !currentVisibility })
        .eq('id', pollId)

      if (error) throw error

      toast.success(currentVisibility ? 'Results hidden from students' : 'Results visible to students')
      fetchPolls()
    } catch (error) {
      console.error('Error updating poll:', error)
      toast.error('Failed to update poll')
    }
  }

  const handleMarkAsCorrect = async (pollId: string, optionId: string) => {
    try {
      const { error } = await supabase
        .from('polls')
        .update({ correct_answer_id: optionId })
        .eq('id', pollId)

      if (error) throw error

      toast.success('Correct answer marked')
      fetchPolls()
    } catch (error) {
      console.error('Error marking correct answer:', error)
      toast.error('Failed to mark correct answer')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const { error } = await supabase
        .from('questions')
        .update({ deleted: true })
        .eq('id', questionId)

      if (error) throw error

      toast.success('Question deleted')
      fetchQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Failed to delete question')
    }
  }

  const handleClearAllQuestions = async () => {
    if (!confirm('Are you sure you want to delete all questions?')) return

    try {
      const sessionData = await supabase
        .from('sessions')
        .select('id')
        .eq('code', code)
        .single()

      if (!sessionData.data) return

      const { error } = await supabase
        .from('questions')
        .update({ deleted: true })
        .eq('session_id', sessionData.data.id)

      if (error) throw error

      toast.success('All questions cleared')
      fetchQuestions()
    } catch (error) {
      console.error('Error clearing questions:', error)
      toast.error('Failed to clear questions')
    }
  }

  const addPollOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, ''])
    }
  }

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index))
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions]
    newOptions[index] = value
    setPollOptions(newOptions)
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

  if (!session) {
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
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Logo height={40} />

            </Link>

            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold text-foreground hidden md:block">{session.title}</h1>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Live</span>
              </div>
              <button onClick={handleEndSession} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
                End Session
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-8 space-y-6">
        {/* Announcement Banner */}
        {announcement && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 whitespace-pre-wrap">{announcement}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
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

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter tabs */}
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

            {/* Questions list */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">No questions yet</p>
                <p className="text-sm text-muted-foreground">
                  Students can join using the code above and start asking questions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 p-5 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-base text-foreground mb-3 leading-relaxed font-medium">
                          {question.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{question.author_name}</span>
                          <span className="text-purple-600 font-semibold">{question.upvotes} upvotes</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            supabase
                              .from('questions')
                              .update({ answered: !question.answered })
                              .eq('id', question.id)
                              .then(() => {
                                toast.success(question.answered ? 'Marked as unanswered' : 'Marked as answered')
                                fetchQuestions()
                              })
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            question.answered
                              ? 'bg-green-100 text-green-700'
                              : 'hover:bg-green-50 text-gray-400'
                          }`}
                          title={question.answered ? 'Answered' : 'Mark as answered'}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        <button
                          onClick={() => {
                            supabase
                              .from('questions')
                              .update({ starred: !question.starred })
                              .eq('id', question.id)
                              .then(() => {
                                toast.success(question.starred ? 'Removed from starred' : 'Added to starred')
                                fetchQuestions()
                              })
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            question.starred
                              ? 'text-yellow-500'
                              : 'hover:bg-yellow-50 text-gray-400'
                          }`}
                          title={question.starred ? 'Starred' : 'Star question'}
                        >
                          <svg className="w-5 h-5" fill={question.starred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete question"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === 'polls' && (
          <div className="space-y-6 animate-fade-in">
            {/* Create New Poll */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 overflow-hidden">
              <button
                onClick={() => setCreatePollExpanded(!createPollExpanded)}
                className="w-full flex items-center justify-between p-5 hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-foreground">Create New Poll</h2>
                    <p className="text-sm text-muted-foreground">Quick feedback from students</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${createPollExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {createPollExpanded && (
                <form onSubmit={handleCreatePoll} className="p-5 border-t space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Poll Question <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPollQuestion}
                      onChange={(e) => setNewPollQuestion(e.target.value)}
                      placeholder="What would you like to ask?"
                      className="input-enhanced"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Options <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="input-enhanced"
                          />
                          {pollOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {pollOptions.length < 10 && (
                      <button
                        type="button"
                        onClick={addPollOption}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="multipleVotes"
                        checked={allowMultipleVotes}
                        onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                        className="w-4 h-4 rounded border-input"
                      />
                      <label htmlFor="multipleVotes" className="text-sm text-foreground">
                        Allow multiple votes
                      </label>
                      {allowMultipleVotes && (
                        <input
                          type="number"
                          min="2"
                          max={pollOptions.length}
                          value={maxVotes}
                          onChange={(e) => setMaxVotes(parseInt(e.target.value))}
                          className="w-20 px-2 py-1 border rounded ml-2"
                        />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showResults"
                        checked={showResultsToStudents}
                        onChange={(e) => setShowResultsToStudents(e.target.checked)}
                        className="w-4 h-4 rounded border-input"
                      />
                      <label htmlFor="showResults" className="text-sm text-foreground">
                        Show results to students
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCreatePollExpanded(false)}
                      className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingPoll}
                      className="btn-primary"
                    >
                      {creatingPoll ? 'Creating...' : 'Create Poll'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Active Polls */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-100 overflow-hidden">
              <button
                onClick={() => setActivePollsExpanded(!activePollsExpanded)}
                className="w-full flex items-center justify-between p-5 hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-foreground">Active Polls</h2>
                    <p className="text-sm text-muted-foreground">{polls.length} poll{polls.length !== 1 ? 's' : ''} collecting votes</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${activePollsExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activePollsExpanded && (
                <div className="p-5 border-t space-y-4">
                  {polls.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No active polls</p>
                  ) : (
                    polls.map((poll) => {
                      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0)

                      return (
                        <div key={poll.id} className="border border-purple-100 rounded-lg p-4 space-y-4 bg-white/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-2">{poll.question}</h3>
                              <div className="flex flex-wrap gap-2">
                                <span className="badge badge-purple">
                                  {poll.allow_multiple_votes ? `Select up to ${poll.max_votes}` : 'Single vote'}
                                </span>
                                <span className="badge badge-green">
                                  {poll.show_results_to_students ? 'Results visible' : 'Results hidden'}
                                </span>
                                <span className="badge badge-gray">{totalVotes} votes</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleResultsVisibility(poll.id, poll.show_results_to_students)}
                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                title={poll.show_results_to_students ? 'Hide results' : 'Show results'}
                              >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {poll.show_results_to_students ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  )}
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeletePoll(poll.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete poll"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {poll.options.map((option) => {
                              const percentage = totalVotes === 0 ? 0 : Math.round((option.vote_count / totalVotes) * 100)
                              const isCorrect = poll.correct_answer_id === option.id

                              return (
                                <div key={option.id} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1">
                                      <span className="text-sm font-medium text-foreground">{option.option_text}</span>
                                      {isCorrect && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <span className="text-sm font-semibold text-purple-600">
                                        {percentage}% ({option.vote_count})
                                      </span>
                                      <button
                                        onClick={() => handleMarkAsCorrect(poll.id, option.id)}
                                        className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                                      >
                                        Mark correct
                                      </button>
                                    </div>
                                  </div>
                                  <div className="w-full bg-purple-100 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 shadow-2xl z-50">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('polls')
                setCreatePollExpanded(true)
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Poll</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code)
                  toast.success('Code copied to clipboard!')
                }}
                className="px-4 py-2 bg-white border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                <div className="text-xl font-mono font-bold text-purple-600">{code}</div>
                <div className="text-xs text-muted-foreground">Session Code</div>
              </button>

              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-purple-200 text-foreground rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Announcement</span>
              </button>

              <button
                onClick={handleToggleQA}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  qaEnabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <span>Toggle QA</span>
                <div className={`w-12 h-6 rounded-full transition-colors ${qaEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${qaEnabled ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                </div>
              </button>

              <button
                onClick={handleClearAllQuestions}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All Questions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Announcement</h2>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message to Students
                </label>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Share links, descriptions, or important updates..."
                  rows={6}
                  className="input-enhanced resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {announcement.length}/1000 characters
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAnnouncement}
                  disabled={sendingAnnouncement}
                  className="btn-primary"
                >
                  {sendingAnnouncement ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session, Question } from '@/types'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import QuestionSkeleton from '@/components/QuestionSkeleton'
import Link from 'next/link'

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

function questionsChanged(oldQs: Question[], newQs: Question[]): boolean {
  if (oldQs.length !== newQs.length) return true
  for (let i = 0; i < oldQs.length; i++) {
    const a = oldQs[i]
    const b = newQs[i]
    if (!b || a.id !== b.id || a.upvotes !== b.upvotes || a.content !== b.content) {
      return true
    }
  }
  return false
}

export default function HostDashboard() {
  const params = useParams()
  const code = params.code as string

  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const [polls, setPolls] = useState<PollWithOptions[]>([])
  const [pollsLoading, setPollsLoading] = useState(true)

  const [newPollQuestion, setNewPollQuestion] = useState('')
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', ''])
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [maxVotes, setMaxVotes] = useState(1)
  const [creatingPoll, setCreatingPoll] = useState(false)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchSession()
    fetchQuestions()
    fetchPolls()

    const interval = setInterval(() => {
      fetchQuestions(false)
      fetchPolls(false)
    }, 3000)

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
      const { data, error } = await supabase.from('sessions').select('*').eq('code', code).single()
      if (error) throw error
      setSession(data)
    } catch (error) {
      console.error('Error fetching session:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async (showSkeleton = true) => {
    if (showSkeleton && questions.length === 0) {
      setQuestionsLoading(true)
    }

    try {
      const sessionData = await supabase.from('sessions').select('id').eq('code', code).single()

      if (sessionData.data) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('session_id', sessionData.data.id)
          .eq('deleted', false)
          .order('upvotes', { ascending: false })

        if (error) throw error

        const newData = data || []
        if (questionsChanged(questions, newData)) {
          setQuestions(newData)
        }
      }
      setQuestionsLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestionsLoading(false)
    }
  }

  const fetchPolls = async (showSkeleton = true) => {
    if (showSkeleton && polls.length === 0) {
      setPollsLoading(true)
    }

    try {
      const sessionData = await supabase.from('sessions').select('id').eq('code', code).single()

      if (!sessionData.data) {
        setPolls([])
        setPollsLoading(false)
        return
      }

      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('session_id', sessionData.data.id)
        .order('created_at', { ascending: false })

      if (pollsError) throw pollsError

      const pollIds = (pollsData || []).map((p) => p.id)
      if (pollIds.length === 0) {
        setPolls([])
        setPollsLoading(false)
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
      setPollsLoading(false)
    } catch (error) {
      console.error('Error fetching polls:', error)
      setPollsLoading(false)
    }
  }

  const endSession = async () => {
    if (!confirm('Are you sure you want to end this session? This cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase.from('sessions').update({ active: false }).eq('code', code)

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

  const handleAddPollOption = () => {
    if (newPollOptions.length >= 10) {
      toast.error('Maximum 10 options allowed')
      return
    }
    setNewPollOptions((prev) => [...prev, ''])
  }

  const handleRemovePollOption = (index: number) => {
    if (newPollOptions.length <= 2) {
      toast.error('At least 2 options are required')
      return
    }
    setNewPollOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPollQuestion.trim()) {
      toast.error('Please enter a poll question')
      return
    }

    const trimmedOptions = newPollOptions.map((o) => o.trim()).filter((o) => o.length > 0)

    if (trimmedOptions.length < 2) {
      toast.error('Please add at least 2 options')
      return
    }

    if (!allowMultipleVotes && maxVotes !== 1) {
      toast.error('For single-vote polls, max votes must be 1')
      return
    }

    if (allowMultipleVotes && (maxVotes < 1 || maxVotes > trimmedOptions.length)) {
      toast.error('Max votes must be between 1 and number of options')
      return
    }

    setCreatingPoll(true)

    try {
      const sessionData = await supabase.from('sessions').select('id').eq('code', code).single()

      if (!sessionData.data) {
        toast.error('Session not found')
        setCreatingPoll(false)
        return
      }

      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert([
          {
            session_id: sessionData.data.id,
            question: newPollQuestion.trim(),
            allow_multiple_votes: allowMultipleVotes,
            max_votes: allowMultipleVotes ? maxVotes : 1,
            active: true,
            show_results_to_students: true,
            correct_answer_id: null,
          },
        ])
        .select()

      if (pollError) throw pollError
      if (!pollData || pollData.length === 0) throw new Error('Failed to create poll')

      const pollId = pollData[0].id as string

      const optionsPayload = trimmedOptions.map((text) => ({
        poll_id: pollId,
        option_text: text,
        vote_count: 0,
      }))

      const { error: optionsError } = await supabase.from('poll_options').insert(optionsPayload)

      if (optionsError) throw optionsError

      toast.success('Poll created')
      setNewPollQuestion('')
      setNewPollOptions(['', ''])
      setAllowMultipleVotes(false)
      setMaxVotes(1)
      fetchPolls()
    } catch (error) {
      console.error('Error creating poll:', error)
      toast.error('Failed to create poll')
    } finally {
      setCreatingPoll(false)
    }
  }

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Delete this poll and its results?')) return

    try {
      const { error } = await supabase.from('polls').delete().eq('id', pollId)
      if (error) throw error
      toast.success('Poll deleted')
      setPolls((prev) => prev.filter((p) => p.id !== pollId))
    } catch (error) {
      console.error('Error deleting poll:', error)
      toast.error('Failed to delete poll')
    }
  }

  const toggleResultsVisibility = async (poll: PollWithOptions) => {
    const newValue = !poll.show_results_to_students
    try {
      const { error } = await supabase
        .from('polls')
        .update({ show_results_to_students: newValue })
        .eq('id', poll.id)
      if (error) throw error
      setPolls((prev) =>
        prev.map((p) => (p.id === poll.id ? { ...p, show_results_to_students: newValue } : p))
      )
      toast.success(`Results visibility ${newValue ? 'enabled' : 'disabled'} for students`)
    } catch (e) {
      console.error(e)
      toast.error('Failed to update visibility')
    }
  }

  const markCorrectAnswer = async (poll: PollWithOptions, optionId: string) => {
    const newCorrectId = poll.correct_answer_id === optionId ? null : optionId
    try {
      const { error } = await supabase
        .from('polls')
        .update({ correct_answer_id: newCorrectId })
        .eq('id', poll.id)
      if (error) throw error
      setPolls((prev) =>
        prev.map((p) => (p.id === poll.id ? { ...p, correct_answer_id: newCorrectId } : p))
      )
      toast.success(newCorrectId ? 'Correct answer marked' : 'Correct answer unmarked')
    } catch (e) {
      console.error(e)
      toast.error('Failed to mark correct answer')
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
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
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{session.title}</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Session Code:</span>
                  <span className="text-2xl font-mono font-bold text-indigo-600">{code}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code)
                      toast.success('Code copied!')
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Copy code"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-700">{session.active ? 'Active' : 'Ended'}</span>
                </div>
                {session.active && (
                  <button onClick={endSession} className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition">
                    End Session
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <span>Questions</span>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full">{questions.length}</span>
                </h2>
                {questions.length > 0 && (
                  <button onClick={() => fetchQuestions()} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1">
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
                    {paginatedQuestions.map((q) => (
                      <div key={q.id} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                        <p className="text-lg text-gray-900 mb-3 leading-relaxed">{q.content}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{q.author_name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span className="font-semibold text-indigo-600">{q.upvotes}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination currentPage={currentPage} totalItems={questions.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                </>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Polls</h2>

              <form onSubmit={handleCreatePoll} className="mb-8 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Poll question</label>
                  <input
                    type="text"
                    value={newPollQuestion}
                    onChange={(e) => setNewPollQuestion(e.target.value)}
                    placeholder="e.g., Which topic should we review next?"
                    maxLength={200}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 bg-white/50 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{newPollQuestion.length}/200</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Options</label>
                  <div className="space-y-2">
                    {newPollOptions.map((opt, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const value = e.target.value
                            setNewPollOptions((prev) => prev.map((p, i) => (i === index ? value : p)))
                          }}
                          placeholder={`Option ${index + 1}`}
                          maxLength={100}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white/50 transition-all duration-200"
                        />
                        <button type="button" onClick={() => handleRemovePollOption(index)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition" title="Remove option">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleAddPollOption} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add option</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-3">
                  <input
                    id="allow_multiple"
                    type="checkbox"
                    checked={allowMultipleVotes}
                    onChange={(e) => {
                      setAllowMultipleVotes(e.target.checked)
                      if (!e.target.checked) setMaxVotes(1)
                    }}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label htmlFor="allow_multiple" className="text-sm text-gray-700">
                    Allow multiple votes per student
                  </label>
                </div>

                {allowMultipleVotes && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Maximum options a student can vote for</label>
                    <input
                      type="number"
                      min={1}
                      max={newPollOptions.length || 1}
                      value={maxVotes}
                      onChange={(e) => setMaxVotes(Number(e.target.value))}
                      className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white/50 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be between 1 and the number of options</p>
                  </div>
                )}

                <button type="submit" disabled={creatingPoll} className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105">
                  {creatingPoll ? 'Creating poll...' : 'Create poll'}
                </button>
              </form>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Existing polls</h3>
                {pollsLoading ? (
                  <p className="text-gray-500 text-sm">Loading polls...</p>
                ) : polls.length === 0 ? (
                  <p className="text-gray-500 text-sm">No polls yet. Create one above to start collecting votes.</p>
                ) : (
                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                    {polls.map((poll) => {
                      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0)

                      return (
                        <div key={poll.id} className="border border-gray-200 rounded-xl p-4 bg-white/70">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{poll.question}</p>
                              <p className="text-xs text-gray-500 mt-1">{poll.allow_multiple_votes ? `Multiple votes allowed (max ${poll.max_votes})` : 'Single vote per student'}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Results visible to students: <span className={poll.show_results_to_students ? 'text-green-600' : 'text-red-500'}>{poll.show_results_to_students ? 'On' : 'Off'}</span>
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <button onClick={() => toggleResultsVisibility(poll)} className="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                                {poll.show_results_to_students ? 'Hide results' : 'Show results'}
                              </button>
                              <button onClick={() => handleDeletePoll(poll.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition" title="Delete poll">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 mt-2">
                            {poll.options.map((opt) => {
                              const percentage = totalVotes === 0 ? 0 : Math.round((opt.vote_count / totalVotes) * 100)
                              const isCorrect = poll.correct_answer_id === opt.id

                              return (
                                <div key={opt.id} className={`text-sm p-3 rounded-lg border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gray-900 font-medium">{opt.option_text}</span>
                                      {isCorrect && (
                                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gray-500 text-xs">
                                        {opt.vote_count} vote{opt.vote_count !== 1 ? 's' : ''} ({percentage}%)
                                      </span>
                                      <button
                                        onClick={() => markCorrectAnswer(poll, opt.id)}
                                        className={`px-2 py-1 text-xs rounded-lg transition ${
                                          isCorrect
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                                        }`}
                                        title={isCorrect ? 'Unmark as correct' : 'Mark as correct'}
                                      >
                                        {isCorrect ? '✓ Correct' : 'Mark correct'}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-2 ${isCorrect ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${percentage}%` }} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <p className="text-xs text-gray-400 mt-2">Total votes: {totalVotes}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

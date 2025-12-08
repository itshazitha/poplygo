'use client'

import { Question } from '@/types'
import { useEffect, useState } from 'react'

interface QuestionItemProps {
  question: Question
  isOnline: boolean
  onUpvote: (id: string, currentUpvotes: number) => void
}

export default function QuestionItem({ question, isOnline, onUpvote }: QuestionItemProps) {
  const [hasUpvoted, setHasUpvoted] = useState(false)

  useEffect(() => {
    const upvotedQuestions = JSON.parse(
      localStorage.getItem('upvoted_questions') || '[]'
    )
    setHasUpvoted(upvotedQuestions.includes(question.id))
  }, [question.id])

  const handleClick = () => {
    if (hasUpvoted || !isOnline) return

    onUpvote(question.id, question.upvotes)

    const upvotedQuestions = JSON.parse(
      localStorage.getItem('upvoted_questions') || '[]'
    )
    upvotedQuestions.push(question.id)
    localStorage.setItem('upvoted_questions', JSON.stringify(upvotedQuestions))
    setHasUpvoted(true)
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
      <p className="text-lg text-gray-900 mb-3 leading-relaxed">{question.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>{question.author_name}</span>
        </div>
        <button
          onClick={handleClick}
          disabled={hasUpvoted || !isOnline}
          className={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
            hasUpvoted || !isOnline
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          <svg
            className={`w-5 h-5 ${
              !hasUpvoted && isOnline ? 'group-hover:scale-125 transition-transform' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span>{question.upvotes}</span>
          {hasUpvoted && <span className="text-xs">(Voted)</span>}
        </button>
      </div>
    </div>
  )
}

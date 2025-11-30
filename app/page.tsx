// Remove 'use client' and add revalidate for ISR
export const revalidate = 3600 // Revalidate every hour (1 hour = 3600 seconds)

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Poplygo</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect lecturers and students with real-time Q&A sessions
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Session
          </Link>
          
          <Link
            href="/join"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Join Session
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">No Sign-Up Required</h3>
            <p className="text-gray-600">Students join instantly with a code</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
            <p className="text-gray-600">Questions appear live for everyone</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Vote on Questions</h3>
            <p className="text-gray-600">Popular questions rise to the top</p>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          A product by DYNARQ
        </div>
      </div>
    </div>
  )
}

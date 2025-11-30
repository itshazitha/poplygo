import Link from 'next/link'

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a session?",
      answer: "Click the 'Create Session' button on the homepage, enter a title for your session, and you'll receive a unique 6-digit code to share with students."
    },
    {
      question: "Students can't join my session. What should I do?",
      answer: "Make sure the session is still active and the code is correct. Sessions automatically end after 24 hours of inactivity. If issues persist, create a new session."
    },
    {
      question: "Can students ask questions anonymously?",
      answer: "Yes! Students can leave the name field blank when submitting questions to remain anonymous. This encourages more participation."
    },
    {
      question: "How does the upvoting system work?",
      answer: "Students can upvote questions they find important. Each student can only upvote a question once. Questions with more upvotes appear at the top."
    },
    {
      question: "Do I need to create an account?",
      answer: "No! Poplygo works without any sign-up. Just create or join a session and start engaging immediately."
    },
    {
      question: "How long do sessions last?",
      answer: "Active sessions last indefinitely until you end them. Inactive sessions (not accessed for 24 hours) are automatically deleted to protect your privacy."
    },
    {
      question: "Can I see who asked which question?",
      answer: "Only if the student chose to include their name. Anonymous questions show 'Anonymous' as the author."
    },
    {
      question: "What happens to my data?",
      answer: "Your session data is stored securely and automatically deleted after 24 hours of inactivity. We never sell your data to third parties."
    },
    {
      question: "The page isn't updating. What should I do?",
      answer: "Questions refresh automatically every 3 seconds. If you're offline, check your internet connection. You can also click the refresh button manually."
    },
    {
      question: "I found a bug. How do I report it?",
      answer: "Click the feedback button in the bottom-right corner of any page. We appreciate your help in making Poplygo better!"
    }
  ]

  const knownIssues = [
    {
      issue: "Questions flash when refreshing",
      solution: "This is normal behavior as the system checks for new questions every 3 seconds. The flash only occurs if data has changed.",
      workaround: "None needed - this ensures you see questions in real-time."
    },
    {
      issue: "Can't upvote after already voting",
      solution: "Each student can only upvote a question once. This is tracked in your browser's local storage.",
      workaround: "Clear your browser's local storage if you need to test multiple votes (only for testing)."
    },
    {
      issue: "Offline warning appears",
      solution: "You've lost internet connection. Some features won't work until you reconnect.",
      workaround: "Check your WiFi or mobile data connection."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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

      <div className="container-responsive py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">Find answers to common questions</p>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 group"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 flex items-center justify-between hover:text-indigo-600 transition">
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Known Issues */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Known Issues & Solutions</h2>
          <div className="space-y-6">
            {knownIssues.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/20"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{item.issue}</h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold text-gray-700">Solution:</span> {item.solution}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-700">Workaround:</span> {item.workaround}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg mb-6 opacity-90">
              Can't find what you're looking for? Send us your feedback or questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@dynarq.com"
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transition"
              >
                Email Support
              </a>
              <Link
                href="/"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-xl font-semibold hover:bg-white/30 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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

        <div className="container-responsive py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20 animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: December 1, 2025</p>
            </div>

            {/* Content */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Poplygo, a product of DYNARQ Software Solutions. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use Poplygo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Session Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Session titles and codes created by educators</li>
                  <li>Questions submitted by students (content and optional names)</li>
                  <li>Upvote counts for questions</li>
                  <li>Session timestamps and activity status</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address (not stored, used only for service delivery)</li>
                  <li>Page views and navigation patterns</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Feedback Data (Optional)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Feedback messages you submit</li>
                  <li>Email address (only if you choose to provide it)</li>
                  <li>Page context where feedback was submitted</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>To provide and maintain the Poplygo service</li>
                  <li>To enable real-time Q&A functionality between educators and students</li>
                  <li>To improve and optimize the user experience</li>
                  <li>To respond to feedback and support requests</li>
                  <li>To detect and prevent technical issues or abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We believe in data minimization and automatic cleanup:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Active Sessions:</strong> Remain stored until you end them manually</li>
                  <li><strong>Inactive Sessions:</strong> Automatically deleted after 24 hours of no activity</li>
                  <li><strong>Questions:</strong> Soft-deleted after session ends, permanently removed after 7 days</li>
                  <li><strong>Feedback:</strong> Retained for product improvement purposes, anonymized after 6 months</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We only share data in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Service Providers:</strong> We use Supabase for database hosting and Vercel for application hosting</li>
                  <li><strong>Legal Compliance:</strong> When required by law or to protect our legal rights</li>
                  <li><strong>Business Transfer:</strong> In case of merger, acquisition, or asset sale (you will be notified)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your data (sessions and questions you created)</li>
                  <li>Delete your data (end sessions to remove associated data)</li>
                  <li>Opt out of optional features (like providing your name when asking questions)</li>
                  <li>Request data portability</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Local Storage</h2>
                <p className="text-gray-700 leading-relaxed">
                  Poplygo uses browser local storage to remember which questions you have upvoted. This data never leaves your device and is not transmitted to our servers. You can clear this data at any time through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Poplygo is designed for educational use and may be used by students of all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you are an educator using Poplygo with students under 13, please ensure you have appropriate permissions from parents or guardians.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS), secure database access controls, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Continued use of Poplygo after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have questions about this Privacy Policy or your data, please contact:
                </p>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-gray-700 border-2 border-indigo-100">
                  <p className="font-semibold text-gray-900 mb-3 text-lg">DYNARQ Software Solutions</p>
                  <p className="mb-1">Email: <a href="mailto:privacy@dynarq.com" className="text-indigo-600 hover:text-indigo-700 font-medium">privacy@dynarq.com</a></p>
                  <p>Website: <a href="https://dynarq.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">dynarq.com</a></p>
                </div>
              </section>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function TermsOfService() {
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
            <Logo height={40} />

          </Link>
        </nav>

        <div className="container-responsive py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20 animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600">Last updated: December 1, 2025</p>
            </div>

            {/* Content */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using Poplygo ("the Service"), a product of DYNARQ Software Solutions ("Company", "we", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Poplygo is a real-time Q&A platform designed for educational settings. The Service allows:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Educators to create Q&A sessions</li>
                  <li>Students to join sessions and submit questions anonymously or with their names</li>
                  <li>Students to upvote questions they find important</li>
                  <li>Real-time synchronization of questions and votes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts and Registration</h2>
                <p className="text-gray-700 leading-relaxed">
                  Poplygo currently operates without user accounts. No registration is required to create or join sessions. By using the Service, you represent that you have the authority to use it for your intended educational purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You agree to use Poplygo only for lawful educational purposes. You must not:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Submit harmful, offensive, or inappropriate content</li>
                  <li>Harass, bully, or threaten other users</li>
                  <li>Attempt to disrupt or compromise the Service's security or functionality</li>
                  <li>Use the Service to spread misinformation or spam</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Collect or harvest data from other users without consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Ownership and Rights</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You retain ownership of the questions, session titles, and other content you submit ("Your Content"). By submitting content to Poplygo, you grant DYNARQ a non-exclusive, worldwide, royalty-free license to use, store, and display Your Content solely for the purpose of providing the Service.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  All design, code, branding, and other intellectual property related to Poplygo remains the exclusive property of DYNARQ Software Solutions. You may not copy, modify, distribute, or create derivative works without our explicit permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data and Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your use of Poplygo is also governed by our <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">Privacy Policy</Link>. We automatically delete inactive sessions after 24 hours to protect your privacy. Questions are soft-deleted and permanently removed after 7 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We strive to provide continuous access to Poplygo, but we do not guarantee:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Uninterrupted or error-free operation</li>
                  <li>100% uptime (planned maintenance may occur)</li>
                  <li>Permanent storage of your data beyond our stated retention periods</li>
                  <li>Compatibility with all devices or browsers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, DYNARQ Software Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. This includes loss of data, business interruption, or any other commercial damages or losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
                <p className="text-gray-700 leading-relaxed">
                  Poplygo is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will meet your requirements or that it will be secure, accurate, or reliable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify and hold harmless DYNARQ Software Solutions, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your access to Poplygo at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service. You may stop using the Service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms from time to time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of Poplygo after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of your jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  For questions about these Terms of Service, please contact:
                </p>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-gray-700 border-2 border-indigo-100">
                  <p className="font-semibold text-gray-900 mb-3 text-lg">DYNARQ Software Solutions</p>
                  <p className="mb-1"><span className="font-medium">Founder & CEO:</span> Hasitha Bandara</p>
                  <p className="mb-1">Email: <a href="mailto:legal@dynarq.com" className="text-indigo-600 hover:text-indigo-700 font-medium">legal@dynarq.com</a></p>
                  <p>Website: <a href="https://dynarq.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">dynarq.com</a></p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgment</h2>
                <p className="text-gray-700 leading-relaxed">
                  By using Poplygo, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
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

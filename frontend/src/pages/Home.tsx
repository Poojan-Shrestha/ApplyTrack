import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  Target, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Briefcase,
  Zap,
  Shield,
  Users,
  Award,
  ClipboardList
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Footer from '../components/common/Footer'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white dark:from-gray-900 dark:via-primary-900/10 dark:to-gray-900">
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <ClipboardList className="h-4 w-4" />
              <span>AI-Powered Application Tracker</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Stay Organized. Get Hired Faster.
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                With AI-Powered Tracking
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Track every application, optimize your resume with AI, and prepare for interviews—all in one organized place. 
              Never miss a follow-up. Never lose track of where you applied.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>Start Tracking Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary text-lg px-8 py-4"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>AI-powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Track & Optimize Applications
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              ApplyTrack helps you stay organized and competitive with AI-powered insights for every application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg transition-all p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Smart Application Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Never lose track of where you applied. Organize all your applications with status tracking, notes, and deadlines.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-lg transition-all p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                ATS Match Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See how well your resume matches each job description. Get keyword insights and improve your match score.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-lg transition-all p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Resume Quality Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI analyzes your resume structure and content. Get actionable improvements to make your resume stand out.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover:shadow-lg transition-all p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                AI Interview Prep
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate personalized interview questions and company-specific tips for every job you track.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card hover:shadow-lg transition-all p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Success Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your application success rate, response times, and identify what's working in your job hunt.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card hover:shadow-lg transition-all p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Progress Monitoring
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your application pipeline with dashboards, timelines, and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From chaos to organized in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Upload Your Resume
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your resume and get instant AI quality analysis with actionable feedback.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Add Your Applications
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track jobs you've applied to, run ATS analysis, and see how your resume matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Prepare & Succeed
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate interview prep, track follow-ups, and land your dream job!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Job Seekers Love ApplyTrack
            </h2>
            <p className="text-xl text-primary-100">
              Get organized, get insights, get hired
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">85%</div>
              <div className="text-primary-100">Avg. Resume Match Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">3x</div>
              <div className="text-primary-100">More Interview Callbacks</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-100">AI Tips Per Application</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-primary-100">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is encrypted and never shared. Your applications stay private.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Powered by Google Gemini AI for instant resume analysis and interview prep.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Built by a Job Seeker
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Created by someone who understands the struggle. Regular updates based on user feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mb-8">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Organized?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Stop using spreadsheets. Start using ApplyTrack.
          </p>
          {!user && (
            <Link
              to="/register"
              className="btn btn-primary text-lg px-10 py-4 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <span>Start Tracking Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
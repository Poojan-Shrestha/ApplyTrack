import { Github, Linkedin, Mail, Heart, Coffee, ExternalLink } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 mb-8">
          
          {/* Left: Brand + Description */}
          <div className="max-w-md">
            <div className="flex items-center space-x-2 mb-3">
                <Logo size={44} showText />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered job application tracker. Stay organized, optimize your resume, get hired faster.
            </p>
          </div>

          {/* Right: Social Links */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Connect with me:</p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/Poojan-Shrestha"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/poojan-shrestha-3748a127a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">LinkedIn</span>
              </a>
              <a
                href="mailto:poojanshrestha102@gmail.com"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <a 
            href="https://github.com/Poojan-Shrestha/ApplyTrack" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-1"
          >
            <span>Source Code</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="mailto:poojanshrestha102@gmail.com"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Contact
          </a>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Back to Top ↑
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center flex-wrap gap-x-2">
            <span>© {currentYear} ApplyTrack.</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current inline" />
              <span>and</span>
              <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400 inline" />
            </span>
            <span>Free forever. No bullshit.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
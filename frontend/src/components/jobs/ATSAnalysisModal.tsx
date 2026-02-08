import { useState, useEffect } from 'react'
import { X, Loader2, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import type { ATSAnalysis, Resume } from '../../types'
import { jobsService } from '../../services/jobs.service'
import toast from 'react-hot-toast'
import ATSScoreCircle from './ATSScoreCircle'

interface ATSAnalysisModalProps {
  jobId: string
  resumes: Resume[]
  resumesLoading?: boolean
  onClose: () => void
  onComplete?: (analysis: ATSAnalysis) => void
}

export default function ATSAnalysisModal({
  jobId,
  resumes,
  resumesLoading = false,
  onClose,
  onComplete
}: ATSAnalysisModalProps) {
  const [selectedResume, setSelectedResume] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null)

  // Initialize selected resume
  useEffect(() => {
    if (resumes.length) {
      setSelectedResume(resumes.find(r => r.isDefault)?._id || resumes[0]._id)
    }
  }, [resumes])

  const handleAnalyze = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume')
      return
    }
    setAnalyzing(true)
    try {
      const result = await jobsService.analyzeATS(jobId, selectedResume)
      setAnalysis(result)
      onComplete?.(result)
      toast.success('ATS analysis complete!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ATS Analysis</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {resumesLoading ? (
            <div className="flex items-center justify-center py-10 space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-700 dark:text-gray-300 mb-4">No resumes found. Please upload a resume first.</p>
              <button onClick={onClose} className="btn btn-primary">Close</button>
            </div>
          ) : !analysis ? (
            <>
              {/* Resume Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Resume</label>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="input w-full mb-4"
                  disabled={analyzing}
                >
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.originalFilename} {r.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !selectedResume}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                {analyzing ? <><Loader2 className="h-5 w-5 animate-spin" /><span>Analyzing...</span></> :
                             <><TrendingUp className="h-5 w-5" /><span>Run ATS Analysis</span></>}
              </button>
            </>
          ) : (
            <div className="space-y-6">
              {/* Score Circle */}
              <div className="flex justify-center py-6">
                <ATSScoreCircle score={analysis.overallScore} size={200} />
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Keyword Match</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.keywordMatch}%</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Formatting</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.formattingScore}%</p>
                </div>
              </div>

              {/* Matched / Missing Keywords */}
              {analysis.matchedKeywords.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Matched Keywords ({analysis.matchedKeywords.length})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchedKeywords.map((k, i) => <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">{k}</span>)}
                  </div>
                </div>
              )}
              {analysis.missingKeywords.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Missing Keywords ({analysis.missingKeywords.length})</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((k, i) => <span key={i} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm rounded-full">{k}</span>)}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Strengths</span>
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Suggestions</span>
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                    {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              <button onClick={onClose} className="btn btn-primary w-full mt-4">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import {
  Sparkles,
  Loader2,
  RefreshCw,
  MessageSquare,
  Code,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import toast from 'react-hot-toast'

import type { Job } from '../../types'
import { interviewPrepService } from '../../services/interviewPrep.service'

interface InterviewPrepTabProps {
  job: Job
  onPrepComplete?: () => void
}

export default function InterviewPrepTab({ 
  job, 
  onPrepComplete 
}: InterviewPrepTabProps) {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [prep, setPrep] = useState<any>(null)
  const [version, setVersion] = useState<number>(1)
  const [viewCount, setViewCount] = useState<number>(0)
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Fetch existing prep WITHOUT generating
  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Get history first (lightweight)
        const historyData = await interviewPrepService.getHistory(job._id)
        if (cancelled) return
        setVersions(historyData)
        
        // If history exists, get the active one
        if (historyData.length > 0) {
          const activeVersion = historyData.find((v: any) => v.isActive)
          if (activeVersion && !cancelled) {
            // Fetch full prep data
            const fullPrep = await interviewPrepService.getById(activeVersion._id)
            if (cancelled) return
            
            setPrep({
              behavioral: fullPrep.behavioral,
              technical: fullPrep.technical,
              questionsToAsk: fullPrep.questionsToAsk,
              tips: fullPrep.tips,
              mistakesToAvoid: fullPrep.mistakesToAvoid,
            })
            setVersion(fullPrep.version)
            setViewCount(fullPrep.viewCount)
            setGeneratedAt(fullPrep.generatedAt)
          }
        }
        // If no history, prep is null → shows "Generate" button
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load prep:', error)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup to prevent state updates after unmount
    return () => {
      cancelled = true
    }
  }, [job._id])

  const handleGenerate = async (regenerate: boolean = false) => {
    setGenerating(true)
    try {
      const response = await interviewPrepService.generate(job._id, regenerate)
      
      if (response.data) {
        setPrep(response.data)
        setVersion(response.version || 1)
        setViewCount(response.viewCount || 0)
        setGeneratedAt(response.generatedAt)
        
        // Refresh history
        const historyData = await interviewPrepService.getHistory(job._id)
        setVersions(historyData)
        
        toast.success(
          regenerate 
            ? 'Interview prep regenerated!' 
            : 'Interview prep generated!'
        )
        onPrepComplete?.()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate interview prep')
    } finally {
      setGenerating(false)
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await interviewPrepService.restore(versionId)
      
      // Fetch the full content of restored version
      const fullPrep = await interviewPrepService.getById(versionId)
      
      setPrep({
        behavioral: fullPrep.behavioral,
        technical: fullPrep.technical,
        questionsToAsk: fullPrep.questionsToAsk,
        tips: fullPrep.tips,
        mistakesToAvoid: fullPrep.mistakesToAvoid,
      })
      setVersion(fullPrep.version)
      setViewCount(fullPrep.viewCount)
      setGeneratedAt(fullPrep.generatedAt)
      
      // Refresh history
      const historyData = await interviewPrepService.getHistory(job._id)
      setVersions(historyData)
      
      setShowHistory(false)
      toast.success('Version restored successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restore version')
    }
  }

  const handleDeleteVersion = async (versionId: string) => {
    if (!confirm('Delete this version permanently?')) return
    
    try {
      await interviewPrepService.delete(versionId)
      
      // Refresh history
      const historyData = await interviewPrepService.getHistory(job._id)
      setVersions(historyData)
      
      // If we deleted the active version, clear prep display
      const hasActive = historyData.some((v: any) => v.isActive)
      if (!hasActive) {
        setPrep(null)
      }
      
      toast.success('Version deleted')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete version')
    }
  }

  if (loading) {
    return (
      <div className="card text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading interview prep...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Generate/Regenerate Section - Always Visible */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span>Interview Preparation</span>
          </h2>

          {prep && versions.length > 1 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn btn-secondary text-sm flex items-center space-x-2"
            >
              {showHistory ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span>Version History ({versions.length})</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get AI-powered interview preparation tailored to <strong>{job.title}</strong> at <strong>{job.company}</strong>.
          </p>

          <button
            onClick={() => handleGenerate(!!prep)}
            disabled={generating}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Interview Prep...</span>
              </>
            ) : (
              <>
                {prep ? (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    <span>Regenerate Interview Prep</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Interview Prep</span>
                  </>
                )}
              </>
            )}
          </button>

          {prep && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Version {version}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Viewed {viewCount} times</span>
                </span>
              </div>
              {generatedAt && (
                <span>
                  Generated {new Date(generatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Version History */}
      {showHistory && versions.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Version History</span>
          </h3>
          <div className="space-y-2">
            {versions.map((v) => (
              <div
                key={v._id}
                className={`p-4 rounded-lg border ${
                  v.isActive
                    ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Version {v.version}
                      </span>
                      {v.isActive && (
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(v.generatedAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>Viewed {v.viewCount} times</span>
                    </div>
                  </div>

                  {!v.isActive && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestoreVersion(v._id)}
                        className="btn btn-secondary text-sm"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeleteVersion(v._id)}
                        className="btn btn-danger text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Prep Content */}
      {prep ? (
        <>
          {/* Behavioral Questions */}
          {prep.behavioral && prep.behavioral.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Behavioral Questions ({prep.behavioral.length})
                </h3>
              </div>
              <div className="space-y-6">
                {prep.behavioral.map((q: any, i: number) => (
                  <div key={i} className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                      {i + 1}. {q.question}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Why this is asked:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {q.why_asked}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          How to answer (STAR framework):
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {q.answer_framework}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Questions */}
          {prep.technical && prep.technical.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Technical Questions ({prep.technical.length})
                </h3>
              </div>
              <div className="space-y-6">
                {prep.technical.map((q: any, i: number) => (
                  <div key={i} className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                      {i + 1}. {q.question}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Key points to cover:
                      </p>
                      <ul className="space-y-2">
                        {q.key_points.map((point: string, j: number) => (
                          <li key={j} className="flex items-start space-x-3">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">•</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions to Ask */}
          {prep.questionsToAsk && prep.questionsToAsk.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Questions to Ask the Interviewer ({prep.questionsToAsk.length})
                </h3>
              </div>
              <div className="space-y-4">
                {prep.questionsToAsk.map((q: any, i: number) => (
                  <div key={i} className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      {q.question}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Purpose:</span> {q.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Tips */}
          {prep.tips && prep.tips.length > 0 && (
            <div className="card bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  Interview Tips ({prep.tips.length})
                </h3>
              </div>
              <ul className="space-y-3">
                {prep.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-xl flex-shrink-0">💡</span>
                    <p className="text-yellow-800 dark:text-yellow-200 flex-1">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mistakes to Avoid */}
          {prep.mistakesToAvoid && prep.mistakesToAvoid.length > 0 && (
            <div className="card bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                  Common Mistakes to Avoid ({prep.mistakesToAvoid.length})
                </h3>
              </div>
              <ul className="space-y-3">
                {prep.mistakesToAvoid.map((mistake: string, i: number) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <p className="text-red-800 dark:text-red-200 flex-1">
                      {mistake}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Interview Prep Yet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Generate AI-powered interview preparation with behavioral questions, technical questions, 
            tips, and more tailored to this specific role.
          </p>
        </div>
      )}
    </div>
  )
}
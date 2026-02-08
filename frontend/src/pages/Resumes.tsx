import { useResumes } from '../hooks/useResumes'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ResumeUpload from '../components/resumes/ResumeUpload'
import ResumeList from '../components/resumes/ResumeList'

export default function Resumes() {
  const {
    resumes,
    loading,
    uploading,
    uploadResume,
    deleteResume,
    setDefault,
    analyzeResume,
  } = useResumes()

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resumes</h1>

      {/* Upload Section */}
      <ResumeUpload
        uploading={uploading}
        onUpload={async (file) => {
          await uploadResume(file)
        }}
      />

      {/* Resumes List */}
      <ResumeList
        resumes={resumes}
        onDelete={async (id) => {
          if (confirm('Are you sure you want to delete this resume?')) {
            await deleteResume(id)
          }
        }}
        onSetDefault={async (id) => {
          await setDefault(id) 
        }}
        onAnalyze={async (id) => {
          await analyzeResume(id)
        }}
      />
    </div>
  )
}
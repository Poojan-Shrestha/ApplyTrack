import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { formatFileSize } from '../../utils/helpers'
import { MAX_RESUME_SIZE } from '../../utils/constants'

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>
  uploading: boolean
}

export default function ResumeUpload({ onUpload, uploading }: ResumeUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0]
        if (error.code === 'file-too-large') {
          alert(`File is too large. Maximum size is ${formatFileSize(MAX_RESUME_SIZE)}`)
        } else if (error.code === 'file-invalid-type') {
          alert('Invalid file type. Please upload PDF')
        }
        return
      }

      if (acceptedFiles.length > 0 && !uploading) {
        await onUpload(acceptedFiles[0])
      }
    },
    [onUpload, uploading]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_RESUME_SIZE,
    multiple: false,
    disabled: uploading,
  })

  return (
    <div
      {...getRootProps()}
      aria-disabled={uploading}
      aria-busy={uploading}
      className={`
        card cursor-pointer transition-all duration-200 border-2 border-dashed
        ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}
        ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="text-center py-12">
        {uploading ? (
          <>
            <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Uploading...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we upload your resume
            </p>
          </>
        ) : isDragReject ? (
          <>
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-600 mb-2">
              Invalid File
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only PDF files up to {formatFileSize(MAX_RESUME_SIZE)} are allowed
            </p>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="h-12 w-12 mx-auto text-primary-600 mb-4" />
            <p className="text-lg font-medium text-primary-600 mb-2">
              Drop your resume here
            </p>
          </>
        ) : (
          <>
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload Your Resume
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag & drop your resume here, or click to browse
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>✓ PDF</span>
              <span>✓ Max {formatFileSize(MAX_RESUME_SIZE)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
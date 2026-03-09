import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { repoSummaryClient } from '../services/api'

const ANALYSIS_STEPS = [
  'Cloning repository...',
  'Extracting commit history...',
  'Analyzing commits...',
  'Identifying phases...',
  'Detecting milestones...',
  'Generating narrative...',
  'Analyzing contributors...',
  'Finalizing...'
]

function AnalyzingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState('starting')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [error, setError] = useState('')

  const repoUrl = location.state?.repoUrl

  useEffect(() => {
    if (!repoUrl) {
      navigate('/')
      return
    }

    let stepIndex = 0
    const stepInterval = setInterval(() => {
      if (stepIndex < ANALYSIS_STEPS.length) {
        setCurrentStep(ANALYSIS_STEPS[stepIndex])
        setProgress(((stepIndex + 1) / ANALYSIS_STEPS.length) * 100)
        stepIndex++
      } else {
        clearInterval(stepInterval)
      }
    }, 1500)

    // Start the actual analysis
    const analyze = async () => {
      try {
        setStatus('analyzing')
        const result = await repoSummaryClient.fetchSummary(repoUrl)
        setStatus('complete')
        
        // Navigate to results page
        setTimeout(() => {
          navigate('/result', { state: { data: result, repoUrl } })
        }, 1000)
      } catch (err) {
        setStatus('error')
        setError(err.message || 'Failed to analyze repository')
      }
    }

    analyze()

    return () => clearInterval(stepInterval)
  }, [repoUrl, navigate])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-red-50 to-slate-100 px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-xl p-8">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Try Another Repository
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="flex flex-col items-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'complete' ? (
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            ) : (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'complete' ? 'Analysis Complete!' : 'Analyzing Repository'}
          </h2>
          
          {/* Current Step */}
          <p className="text-gray-600 mb-8 text-center">
            {status === 'complete' ? 'Preparing your results...' : currentStep}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Percentage */}
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>

          {/* Repository info */}
          <div className="mt-6 w-full rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-900 font-medium mb-1">Repository:</p>
            <p className="text-xs text-blue-800 break-all">{repoUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyzingPage

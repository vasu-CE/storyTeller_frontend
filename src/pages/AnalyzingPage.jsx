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
      <div className="min-h-screen bg-[#f5f7fb] px-4 py-12 flex items-center justify-center dark:bg-[#0f1117]">
        <div className="max-w-md w-full rounded-xl border border-[#d8deea] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="mb-2 text-2xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">Analysis Failed</h2>
            <p className="mb-6 text-[#6f768d] dark:text-[#9aa0b8]">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg border border-[#6c63ff] bg-[#6c63ff] px-6 py-3 font-medium text-white transition hover:bg-[#5c54e6]"
            >
              Try Another Repository
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-12 flex items-center justify-center dark:bg-[#0f1117]">
      <div className="max-w-md w-full rounded-xl border border-[#d8deea] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
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
          <h2 className="mb-2 text-2xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">
            {status === 'complete' ? 'Analysis Complete!' : 'Analyzing Repository'}
          </h2>
          
          {/* Current Step */}
          <p className="mb-8 text-center text-[#6f768d] dark:text-[#9aa0b8]">
            {status === 'complete' ? 'Preparing your results...' : currentStep}
          </p>

          {/* Progress Bar */}
          <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-[#f0f3fa] dark:bg-[#252836]">
            <div
              className="h-full rounded-full bg-[#6c63ff] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Percentage */}
          <span className="text-sm font-medium text-[#191c26] dark:text-[#eaeaf0]">
            {Math.round(progress)}%
          </span>

          {/* Repository info */}
          <div className="mt-6 w-full rounded-lg border border-[#d8deea] bg-[#f0f3fa] p-3 dark:border-[#2e3142] dark:bg-[#21242f]">
            <p className="mb-1 text-xs font-medium text-[#191c26] dark:text-[#eaeaf0]">Repository:</p>
            <p className="break-all text-xs text-[#6f768d] dark:text-[#9aa0b8]">{repoUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyzingPage

import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import AnalysisProgress from '../components/AnalysisProgress'
import useAnalyzeStream from '../hooks/useAnalyzeStream'

function AnalyzingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const hasNavigatedRef = useRef(false)

  const repoUrl = location.state?.repoUrl
  const { progress, result, error, isLoading } = useAnalyzeStream(repoUrl)

  useEffect(() => {
    if (!repoUrl) {
      navigate('/')
      return undefined
    }

    return undefined
  }, [repoUrl, navigate])

  useEffect(() => {
    if (!result || hasNavigatedRef.current) {
      return
    }

    hasNavigatedRef.current = true
    navigate('/result', { state: { data: result, repoUrl } })
  }, [navigate, repoUrl, result])

  if (error) {
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
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-12 dark:bg-[#0f1117]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <AnalysisProgress progress={progress} />

        <div className="rounded-xl border border-[#d8deea] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <p className="mb-1 text-xs font-medium text-[#191c26] dark:text-[#eaeaf0]">Repository:</p>
          <p className="break-all text-xs text-[#6f768d] dark:text-[#9aa0b8]">{repoUrl}</p>
          {!isLoading && !error && (
            <p className="mt-3 text-sm text-[#6f768d] dark:text-[#9aa0b8]">Preparing results...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyzingPage

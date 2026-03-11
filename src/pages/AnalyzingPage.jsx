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
  const forceSync = Boolean(location.state?.forceSync)
  const { progress, result, error, isLoading } = useAnalyzeStream(repoUrl, { forceSync })

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
      <div className="min-h-screen bg-[var(--bg)] px-4 py-12 flex items-center justify-center dark:bg-[var(--bg)]">
        <div className="max-w-md w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="mb-2 text-2xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Analysis Failed</h2>
            <p className="mb-6 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 font-medium text-white transition hover:bg-[#6d5ce7]"
            >
              Try Another Repository
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-12 dark:bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AnalysisProgress progress={progress} />

        <div className="rounded-2xl border border-[var(--border-bright)] bg-[rgba(15,17,28,0.92)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)] dark:border-[var(--border-bright)] dark:bg-[rgba(15,17,28,0.92)]">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.09em] text-[var(--text-muted)]">Repository</p>
          <p className="break-all text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{repoUrl}</p>
          {forceSync && (
            <p className="mt-3 text-sm text-amber-300">Synchronizing repository data with the latest remote HEAD...</p>
          )}
          {!isLoading && !error && (
            <p className="mt-3 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">Preparing results...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyzingPage

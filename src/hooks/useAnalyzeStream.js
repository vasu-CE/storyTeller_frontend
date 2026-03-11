import { useEffect, useState } from 'react'
import { getAnalyzeStreamUrl } from '../services/api'

const INITIAL_PROGRESS = {
  step: 'extracting',
  message: 'Connecting to analysis stream...',
  percent: 0,
}

export function useAnalyzeStream(repoUrl, options = {}) {
  const { forceSync = false } = options
  const [progress, setProgress] = useState(() => INITIAL_PROGRESS)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(() => Boolean(repoUrl))

  useEffect(() => {
    if (!repoUrl) {
      return undefined
    }

    setProgress(INITIAL_PROGRESS)
    setResult(null)
    setError('')
    setIsLoading(true)

    const eventSource = new EventSource(getAnalyzeStreamUrl(repoUrl, { forceSync }))
    let isClosedByApp = false

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.step === 'complete') {
          setProgress(data)
          setResult(data.result)
          setIsLoading(false)
          isClosedByApp = true
          eventSource.close()
          return
        }

        if (data.step === 'error') {
          setError(data.message || 'Analysis failed')
          setIsLoading(false)
          isClosedByApp = true
          eventSource.close()
          return
        }

        setProgress(data)
      } catch {
        setError('Invalid stream response')
        setIsLoading(false)
        isClosedByApp = true
        eventSource.close()
      }
    }

    eventSource.onerror = () => {
      if (isClosedByApp) {
        return
      }

      setError('Connection lost')
      setIsLoading(false)
      isClosedByApp = true
      eventSource.close()
    }

    return () => {
      isClosedByApp = true
      eventSource.close()
    }
  }, [forceSync, repoUrl])

  return { progress, result, error, isLoading }
}

export default useAnalyzeStream
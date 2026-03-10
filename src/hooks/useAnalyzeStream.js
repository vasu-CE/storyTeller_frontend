import { useEffect, useState } from 'react'
import { getAnalyzeStreamUrl } from '../services/api'

const INITIAL_PROGRESS = {
  step: 'extracting',
  message: 'Connecting to analysis stream...',
  percent: 0,
}

export function useAnalyzeStream(repoUrl) {
  const [progress, setProgress] = useState(() => INITIAL_PROGRESS)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(() => Boolean(repoUrl))

  useEffect(() => {
    if (!repoUrl) {
      return undefined
    }

    const eventSource = new EventSource(getAnalyzeStreamUrl(repoUrl))
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
  }, [repoUrl])

  return { progress, result, error, isLoading }
}

export default useAnalyzeStream
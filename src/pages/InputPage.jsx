import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, BookOpen } from 'lucide-react'
import { Button } from '../components/ui/button'

function InputPage() {
  const navigate = useNavigate()
  const [repoUrl, setRepoUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isValidUrl = (value) => {
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedUrl = repoUrl.trim()

    if (!trimmedUrl) {
      setError('Please enter a repository URL')
      return
    }

    if (!isValidUrl(trimmedUrl)) {
      setError('Enter a valid repository URL that starts with http:// or https://')
      return
    }

    setError('')
    setIsLoading(true)
    
    // Navigate to progress page with repo URL
    navigate('/analyzing', { state: { repoUrl: trimmedUrl } })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Git History Storyteller
          </h1>
          <p className="text-lg text-gray-600">
            Transform your repository's commit history into a compelling narrative
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="block text-sm font-semibold text-gray-800">
                Repository URL
              </label>
              <div className="relative">
                <Github className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="repo-url"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value)
                    error && setError('')
                  }}
                  placeholder="https://github.com/owner/repository"
                  autoComplete="off"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <p className="text-xs text-gray-500">
                Supports public GitHub, GitLab, and other Git repositories
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !repoUrl.trim()}
              className="w-full h-12 rounded-lg font-medium text-base"
            >
              {isLoading ? 'Starting Analysis...' : 'Analyze Repository'}
            </Button>
          </form>

          {/* Examples */}
          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">Try these example repositories:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setRepoUrl('https://github.com/facebook/react')}
                  className="hover:underline"
                >
                  https://github.com/facebook/react
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setRepoUrl('https://github.com/microsoft/vscode')}
                  className="hover:underline"
                >
                  https://github.com/microsoft/vscode
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputPage

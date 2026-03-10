import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, BookOpen, GitBranch, Clock3, ShieldCheck } from 'lucide-react'
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
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-[#6f768d] dark:bg-[#0f1117] dark:text-[#9aa0b8]">
      <main className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 sm:px-2 lg:grid-cols-2 lg:px-6">
        <section className="hero-reveal mt-6 space-y-6 lg:pr-8">
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold leading-[1.05] text-[#191c26] sm:text-5xl lg:text-6xl dark:text-[#eaeaf0]">
              The GitHub Narrative
              <span className="block text-[#6c63ff]">
                Intelligence Console
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#6f768d] sm:text-lg dark:text-[#9aa0b8]">
              Turn raw commit streams into timelines, milestones, contributor intelligence, and documentary-style project stories in one focused analysis.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="glass-card stagger-item rounded-2xl p-4" style={{ animationDelay: '80ms' }}>
              <GitBranch className="mb-2 h-5 w-5 text-[#6c63ff]" />
              <p className="text-xs uppercase tracking-wide text-[#7b8099]">Timeline Aware</p>
              <p className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">Phase-by-phase project arc</p>
            </div>
            <div className="glass-card stagger-item rounded-2xl p-4" style={{ animationDelay: '180ms' }}>
              <Clock3 className="mb-2 h-5 w-5 text-[#6c63ff]" />
              <p className="text-xs uppercase tracking-wide text-[#7b8099]">Fast Analysis</p>
              <p className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">Optimized for long histories</p>
            </div>
            <div className="glass-card stagger-item rounded-2xl p-4" style={{ animationDelay: '280ms' }}>
              <ShieldCheck className="mb-2 h-5 w-5 text-[#00c896]" />
              <p className="text-xs uppercase tracking-wide text-[#7b8099]">Reliable Output</p>
              <p className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">Structured JSON insights</p>
            </div>
          </div>
        </section>

        <section className="hero-reveal [animation-delay:140ms]">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[#d8deea] bg-[#f0f3fa] p-2.5 dark:border-[#2e3142] dark:bg-[#252836]">
                  <BookOpen className="h-5 w-5 text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#7b8099]">Repository Input</p>
                  <h2 className="text-lg font-semibold text-[#191c26] dark:text-[#eaeaf0]">Start Your Analysis</h2>
                </div>
              </div>
              <Github className="h-6 w-6 text-[#7b8099]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="repo-url" className="block text-sm font-medium text-[#191c26] dark:text-[#eaeaf0]">
                  Repository URL
                </label>
                <div className="relative">
                  <Github className="absolute left-4 top-3.5 h-5 w-5 text-[#7b8099]" />
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
                    className="w-full rounded-xl border border-[#d8deea] bg-white py-3 pl-12 pr-4 text-[#191c26] placeholder:text-[#7b8099] disabled:cursor-not-allowed disabled:opacity-70 focus:border-[#6c63ff] focus:outline-none dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0]"
                  />
                </div>
                <p className="text-xs text-[#7b8099]">
                  Supports public GitHub, GitLab, and other Git repositories
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-[#d8deea] bg-[#f0f3fa] p-3 text-sm text-[#191c26] dark:border-[#2e3142] dark:bg-[#252836] dark:text-[#eaeaf0]">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !repoUrl.trim()}
                className="h-12 w-full rounded-lg border border-[#6c63ff] bg-[#6c63ff] text-base font-semibold text-white hover:bg-[#5c54e6]"
              >
                {isLoading ? 'Starting Analysis...' : 'Analyze Repository'}
              </Button>
            </form>

          <div className="mt-6 grid gap-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8099]">Popular examples</p>
            <button
              type="button"
              onClick={() => setRepoUrl('https://github.com/facebook/react')}
              className="rounded-lg border border-[#d8deea] bg-white px-3 py-2 text-left text-[#191c26] transition hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0] dark:hover:bg-[#252836]"
            >
              github.com/facebook/react
            </button>
            <button
              type="button"
              onClick={() => setRepoUrl('https://github.com/microsoft/vscode')}
              className="rounded-lg border border-[#d8deea] bg-white px-3 py-2 text-left text-[#191c26] transition hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0] dark:hover:bg-[#252836]"
            >
              github.com/microsoft/vscode
            </button>
          </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default InputPage

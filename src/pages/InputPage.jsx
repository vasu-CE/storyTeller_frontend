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
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--text-secondary)] dark:bg-[var(--bg)] dark:text-[var(--text-secondary)]">
      <main className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 sm:px-2 lg:grid-cols-2 lg:px-6">
        <section className="hero-reveal mt-6 space-y-6 lg:pr-8">
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold leading-[1.05] text-[var(--text-primary)] sm:text-5xl lg:text-6xl dark:text-[var(--text-primary)]">
              The GitHub Narrative
              <span className="block text-[var(--accent)]">
                Intelligence Console
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg dark:text-[var(--text-secondary)]">
              Turn raw commit streams into timelines, milestones, contributor intelligence, and documentary-style project stories in one focused analysis.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="glass-card stagger-item rounded-2xl p-4" style={{ animationDelay: '80ms' }}>
              <GitBranch className="mb-2 h-5 w-5 text-[var(--accent)]" />
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Timeline Aware</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Phase-by-phase project arc</p>
            </div>
            <div className="glass-card stagger-item rounded-2xl p-4" style={{ animationDelay: '180ms' }}>
              <Clock3 className="mb-2 h-5 w-5 text-[var(--accent)]" />
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Fast Analysis</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Optimized for long histories</p>
            </div>
            <div className="glass-card stagger-item rounded-2xl p-4" style={{ animationDelay: '280ms' }}>
              <ShieldCheck className="mb-2 h-5 w-5 text-[var(--green)]" />
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Reliable Output</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Structured JSON insights</p>
            </div>
          </div>
        </section>

        <section className="hero-reveal [animation-delay:140ms]">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-2.5 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                  <BookOpen className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Repository Input</p>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Start Your Analysis</h2>
                </div>
              </div>
              <Github className="h-6 w-6 text-[var(--text-muted)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="repo-url" className="block text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                  Repository URL
                </label>
                <div className="relative">
                  <Github className="absolute left-4 top-3.5 h-5 w-5 text-[var(--text-muted)]" />
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
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-70 focus:border-[var(--accent)] focus:outline-none dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]"
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Supports public GitHub, GitLab, and other Git repositories
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-3 text-sm text-[var(--text-primary)] dark:border-[var(--border)] dark:bg-[var(--surface3)] dark:text-[var(--text-primary)]">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !repoUrl.trim()}
                className="h-12 w-full rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-base font-semibold text-white hover:bg-[#6d5ce7]"
              >
                {isLoading ? 'Starting Analysis...' : 'Analyze Repository'}
              </Button>
            </form>

          <div className="mt-6 grid gap-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Popular examples</p>
            <button
              type="button"
              onClick={() => setRepoUrl('https://github.com/facebook/react')}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-[var(--text-primary)] transition hover:bg-[var(--surface3)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
            >
              github.com/facebook/react
            </button>
            <button
              type="button"
              onClick={() => setRepoUrl('https://github.com/microsoft/vscode')}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-[var(--text-primary)] transition hover:bg-[var(--surface3)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
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

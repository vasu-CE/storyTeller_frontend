import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, BookOpen, Database, GitBranch, Clock3, RefreshCw, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { repoSummaryClient } from '../services/api'

function formatRelativeDate(value) {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getSyncLabel(repository) {
  return repository?.cache?.syncStatus === 'stale' ? 'Out of sync' : 'Synchronized'
}

function InputPage() {
  const navigate = useNavigate()
  const [repoUrl, setRepoUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [storedRepositories, setStoredRepositories] = useState([])
  const [repositoryError, setRepositoryError] = useState('')
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadRepositories() {
      try {
        setRepositoryError('')
        const repositories = await repoSummaryClient.listRepositories()

        if (isMounted) {
          setStoredRepositories(repositories)
        }
      } catch (loadError) {
        if (isMounted) {
          setRepositoryError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoadingRepositories(false)
        }
      }
    }

    loadRepositories()

    return () => {
      isMounted = false
    }
  }, [])

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

  const openStoredRepository = (selectedRepoUrl, forceSync = false) => {
    navigate('/analyzing', { state: { repoUrl: selectedRepoUrl, forceSync } })
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-secondary)] dark:bg-[var(--bg)] dark:text-[var(--text-secondary)]">
      <div className="flex min-h-screen flex-col">
        {/* Top Main — Hero & Analyze Form */}
        <main className="hero-reveal flex flex-col items-center justify-center gap-8 px-6 py-16 lg:py-24">
          <div className="w-full max-w-2xl space-y-3 text-center">
            <h1 className="text-4xl font-bold leading-tight text-[var(--text-primary)] dark:text-[var(--text-primary)]">
              GitHub Narrative
              <span className="block text-[var(--accent)]">Intelligence Console</span>
            </h1>
            <p className="text-base leading-relaxed text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
              Turn raw commit streams into timelines, milestones, and documentary-style project stories.
            </p>
          </div>

          <div className="glass-card w-full max-w-2xl rounded-2xl p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-2 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                <BookOpen className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Repository Input</p>
                <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Start Your Analysis</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="repo-url" className="block text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                  Repository URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    id="repo-url"
                    type="url"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value)
                      error && setError('')
                    }}
                    placeholder="https://github.com/owner/repo"
                    autoComplete="off"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-70 focus:border-[var(--accent)] focus:outline-none dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]"
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">GitHub, GitLab, and public Git repos</p>
              </div>

              {error && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-3 text-xs text-[var(--text-primary)] dark:border-[var(--border)] dark:bg-[var(--surface3)] dark:text-[var(--text-primary)]">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !repoUrl.trim()}
                className="h-10 w-full rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-sm font-semibold text-white hover:bg-[#6d5ce7]"
              >
                {isLoading ? 'Starting Analysis...' : 'Analyze Repository'}
              </Button>
            </form>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <p className="col-span-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Popular examples</p>
              <button
                type="button"
                onClick={() => setRepoUrl('https://github.com/facebook/react')}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-xs text-[var(--text-primary)] transition hover:bg-[var(--surface3)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
              >
                github.com/facebook/react
              </button>
              <button
                type="button"
                onClick={() => setRepoUrl('https://github.com/microsoft/vscode')}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-xs text-[var(--text-primary)] transition hover:bg-[var(--surface3)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
              >
                github.com/microsoft/vscode
              </button>
            </div>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-3">
              <GitBranch className="mb-1 h-4 w-4 text-[var(--accent)]" />
              <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Phase-by-phase project arc</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <Clock3 className="mb-1 h-4 w-4 text-[var(--accent)]" />
              <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Optimized for long histories</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <ShieldCheck className="mb-1 h-4 w-4 text-[var(--green)]" />
              <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Structured JSON insights</p>
            </div>
          </div>
        </main>

        {/* Bottom Section — Stored Repositories */}
        <section className="hero-reveal border-t border-[var(--border)] px-6 pb-12 pt-10 [animation-delay:220ms] dark:border-[var(--border)]">
          <div className="mx-auto max-w-5xl">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-2.5 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                  <Database className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Stored Analyses</p>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Repository Data In Database</h2>
                </div>
              </div>
              <span className="text-sm text-[var(--text-muted)]">{storedRepositories.length} saved</span>
            </div>

            {isLoadingRepositories && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--text-secondary)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-secondary)]">
                Loading stored repositories...
              </div>
            )}

            {!isLoadingRepositories && repositoryError && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--text-primary)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]">
                {repositoryError}
              </div>
            )}

            {!isLoadingRepositories && !repositoryError && storedRepositories.length === 0 && (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-sm text-[var(--text-secondary)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-secondary)]">
                No repository analyses have been saved yet. Analyze a repository once and it will appear here.
              </div>
            )}

            {!isLoadingRepositories && !repositoryError && storedRepositories.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {storedRepositories.map((repository) => {
                  const isStale = repository?.cache?.syncStatus === 'stale'

                  return (
                    <div
                      key={repository.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 dark:border-[var(--border)] dark:bg-[var(--surface2)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                            {repository.repoOwner && repository.repoName
                              ? `${repository.repoOwner}/${repository.repoName}`
                              : repository.repoUrl}
                          </p>
                          <p className="mt-1 break-all text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                            {repository.repoUrl}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            isStale
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
                          }`}
                        >
                          {getSyncLabel(repository)}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Commits</p>
                          <p className="mt-1 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{repository.totalCommits}</p>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Contributors</p>
                          <p className="mt-1 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{repository.totalContributors}</p>
                        </div>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Analyzed</p>
                          <p className="mt-1 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{formatRelativeDate(repository.analyzedAt)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          onClick={() => openStoredRepository(repository.repoUrl)}
                          className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[#6d5ce7]"
                        >
                          View Data
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openStoredRepository(repository.repoUrl, true)}
                          className="rounded-lg"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Synchronize
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default InputPage

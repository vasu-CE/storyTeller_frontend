import { Users, GitCommit, Code, User } from 'lucide-react'

function ContributorPanel({ contributors }) {
  const contributorList = Array.isArray(contributors?.contributors)
    ? contributors.contributors
    : Array.isArray(contributors)
      ? contributors
      : []

  if (contributorList.length === 0) {
    return <div className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No contributor data available</div>
  }

  // Calculate totals
  const totalCommits = contributorList.reduce((sum, c) => sum + (c.commits || 0), 0)
  const totalAdditions = contributorList.reduce((sum, c) => sum + (c.additions || c.insertions || 0), 0)
  const totalDeletions = contributorList.reduce((sum, c) => sum + (c.deletions || 0), 0)
  const totalContributors = contributors?.totalContributors || contributorList.length
  const busFactor = contributors?.busFactor
  const collaborationPeriods = Array.isArray(contributors?.collaborationPeriods)
    ? contributors.collaborationPeriods
    : []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-[22px] font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Contributors</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Contributors</p>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{totalContributors}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <GitCommit className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Total Commits</p>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{totalCommits.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Lines Added</p>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{totalAdditions.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-[var(--accent)]" />
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Lines Deleted</p>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{totalDeletions.toLocaleString()}</p>
        </div>
      </div>

      {(busFactor || collaborationPeriods.length > 0) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {busFactor ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Bus Factor</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{busFactor}</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                {busFactor === 1
                  ? 'Knowledge is concentrated in one primary contributor.'
                  : `At least ${busFactor} contributors are needed to cover half of commit history.`}
              </p>
            </div>
          ) : null}

          {collaborationPeriods.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Collaboration Peaks</p>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                {collaborationPeriods.slice(0, 5).map((period) => (
                  <li key={period.month}>
                    <span className="font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">{period.month}</span>
                    {' · '}
                    {period.activeContributors} active contributors, {period.totalCommits} commits
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {/* Contributors List */}
      <div className="space-y-3">
        {contributorList.map((contributor, index) => {
          const commits = contributor.commits || 0
          const additions = contributor.additions || contributor.insertions || 0
          const deletions = contributor.deletions || 0
          const percentage = totalCommits > 0 ? ((commits / totalCommits) * 100).toFixed(1) : 0
          const contributorName = contributor.name || 'Unknown'

          return (
            <div
              key={index}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:bg-[var(--surface3)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] dark:hover:bg-[var(--surface2)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--surface2)] text-[var(--text-primary)] font-semibold dark:bg-[var(--surface3)] dark:text-[var(--text-primary)]">
                    {contributorName?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{contributorName}</h3>
                    {contributor.email && (
                      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-muted)]">{contributor.email}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{commits}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">commits</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">Contribution</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface2)] dark:bg-[var(--surface3)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">+{additions.toLocaleString()}</span>
                  <span className="text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">additions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">-{deletions.toLocaleString()}</span>
                  <span className="text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">deletions</span>
                </div>
              </div>

              {/* First/Last Commit */}
              {(contributor.firstCommit || contributor.lastCommit || contributor.first_commit_date || contributor.last_commit_date) && (
                <div className="mt-3 border-t border-[var(--border)] pt-3 text-[11px] text-[var(--text-secondary)] dark:border-[var(--border)] dark:text-[var(--text-muted)]">
                  <div className="grid grid-cols-2 gap-2">
                    {(contributor.firstCommit || contributor.first_commit_date) && (
                      <div>
                        <span className="font-medium">First: </span>
                        {new Date(contributor.firstCommit || contributor.first_commit_date).toLocaleDateString()}
                      </div>
                    )}
                    {(contributor.lastCommit || contributor.last_commit_date) && (
                      <div>
                        <span className="font-medium">Last: </span>
                        {new Date(contributor.lastCommit || contributor.last_commit_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContributorPanel

import { Users, GitCommit, Code, User } from 'lucide-react'

function ContributorPanel({ contributors }) {
  const contributorList = Array.isArray(contributors?.contributors)
    ? contributors.contributors
    : Array.isArray(contributors)
      ? contributors
      : []

  if (contributorList.length === 0) {
    return <div className="text-[#6f768d] dark:text-[#7b8099]">No contributor data available</div>
  }

  // Calculate totals
  const totalCommits = contributorList.reduce((sum, c) => sum + (c.commits || 0), 0)
  const totalAdditions = contributorList.reduce((sum, c) => sum + (c.additions || c.insertions || 0), 0)
  const totalDeletions = contributorList.reduce((sum, c) => sum + (c.deletions || 0), 0)
  const totalContributors = contributors?.totalContributors || contributorList.length

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-[#6c63ff]" />
        <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Contributors</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-[#6c63ff]" />
            <p className="text-[11px] uppercase tracking-wide text-[#6f768d] dark:text-[#7b8099]">Contributors</p>
          </div>
          <p className="text-xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{totalContributors}</p>
        </div>

        <div className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <GitCommit className="h-4 w-4 text-[#6c63ff]" />
            <p className="text-[11px] uppercase tracking-wide text-[#6f768d] dark:text-[#7b8099]">Total Commits</p>
          </div>
          <p className="text-xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{totalCommits.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-[#6c63ff]" />
            <p className="text-[11px] uppercase tracking-wide text-[#6f768d] dark:text-[#7b8099]">Lines Added</p>
          </div>
          <p className="text-xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{totalAdditions.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-[#6c63ff]" />
            <p className="text-[11px] uppercase tracking-wide text-[#6f768d] dark:text-[#7b8099]">Lines Deleted</p>
          </div>
          <p className="text-xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{totalDeletions.toLocaleString()}</p>
        </div>
      </div>

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
              className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] dark:hover:bg-[#21242f]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#6c63ff] bg-[#eef1f7] text-[#191c26] font-semibold dark:bg-[#252836] dark:text-[#eaeaf0]">
                    {contributorName?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#191c26] dark:text-[#eaeaf0]">{contributorName}</h3>
                    {contributor.email && (
                      <p className="text-sm text-[#6f768d] dark:text-[#7b8099]">{contributor.email}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{commits}</p>
                  <p className="text-[11px] text-[#6f768d] dark:text-[#7b8099]">commits</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-[#6f768d] dark:text-[#7b8099]">Contribution</span>
                  <span className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">{percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eef1f7] dark:bg-[#252836]">
                  <div
                    className="h-full rounded-full bg-[#6c63ff] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">+{additions.toLocaleString()}</span>
                  <span className="text-[11px] text-[#6f768d] dark:text-[#7b8099]">additions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">-{deletions.toLocaleString()}</span>
                  <span className="text-[11px] text-[#6f768d] dark:text-[#7b8099]">deletions</span>
                </div>
              </div>

              {/* First/Last Commit */}
              {(contributor.firstCommit || contributor.lastCommit || contributor.first_commit_date || contributor.last_commit_date) && (
                <div className="mt-3 border-t border-[#d8deea] pt-3 text-[11px] text-[#6f768d] dark:border-[#2e3142] dark:text-[#7b8099]">
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

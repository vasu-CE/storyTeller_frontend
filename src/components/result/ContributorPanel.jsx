import { Users, GitCommit, Code, User } from 'lucide-react'

function ContributorPanel({ contributors }) {
  const contributorList = Array.isArray(contributors?.contributors)
    ? contributors.contributors
    : Array.isArray(contributors)
      ? contributors
      : []

  if (contributorList.length === 0) {
    return <div className="text-gray-500">No contributor data available</div>
  }

  // Calculate totals
  const totalCommits = contributorList.reduce((sum, c) => sum + (c.commits || 0), 0)
  const totalAdditions = contributorList.reduce((sum, c) => sum + (c.additions || c.insertions || 0), 0)
  const totalDeletions = contributorList.reduce((sum, c) => sum + (c.deletions || 0), 0)
  const totalContributors = contributors?.totalContributors || contributorList.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Contributors</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-semibold text-blue-900 uppercase">Contributors</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalContributors}</p>
        </div>

        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <GitCommit className="h-4 w-4 text-green-600" />
            <p className="text-xs font-semibold text-green-900 uppercase">Total Commits</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{totalCommits.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-purple-600" />
            <p className="text-xs font-semibold text-purple-900 uppercase">Lines Added</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{totalAdditions.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <Code className="h-4 w-4 text-orange-600" />
            <p className="text-xs font-semibold text-orange-900 uppercase">Lines Deleted</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{totalDeletions.toLocaleString()}</p>
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
              className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {contributorName?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{contributorName}</h3>
                    {contributor.email && (
                      <p className="text-sm text-gray-600">{contributor.email}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{commits}</p>
                  <p className="text-xs text-gray-600">commits</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Contribution</span>
                  <span className="text-xs font-semibold text-gray-900">{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">+{additions.toLocaleString()}</span>
                  <span className="text-gray-600">additions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">-{deletions.toLocaleString()}</span>
                  <span className="text-gray-600">deletions</span>
                </div>
              </div>

              {/* First/Last Commit */}
              {(contributor.firstCommit || contributor.lastCommit || contributor.first_commit_date || contributor.last_commit_date) && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    {(contributor.firstCommit || contributor.first_commit_date) && (
                      <div>
                        <span className="font-semibold">First: </span>
                        {new Date(contributor.firstCommit || contributor.first_commit_date).toLocaleDateString()}
                      </div>
                    )}
                    {(contributor.lastCommit || contributor.last_commit_date) && (
                      <div>
                        <span className="font-semibold">Last: </span>
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

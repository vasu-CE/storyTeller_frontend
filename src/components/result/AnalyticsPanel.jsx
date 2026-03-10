import { BarChart3, PieChart, Activity, GitBranch } from 'lucide-react'

function toNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function AnalyticsPanel({ data }) {
  if (!data) {
    return <div className="text-gray-500">No analytics data available</div>
  }

  const phases = Array.isArray(data.phases) ? data.phases : []
  const milestones = Array.isArray(data.milestones) ? data.milestones : []
  const classification = data.classification || {}
  const contributors = Array.isArray(data.contributors?.contributors)
    ? data.contributors.contributors
    : Array.isArray(data.contributors)
      ? data.contributors
      : []

  const commitTypeRows = Object.entries(classification)
    .filter(([key]) => key !== 'total')
    .map(([type, value]) => ({ type, count: toNumber(value) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)

  const maxTypeCount = Math.max(...commitTypeRows.map((item) => item.count), 1)

  const phaseRows = phases.map((phase, index) => ({
    label: phase.phase_name || `Phase ${index + 1}`,
    period: phase.period || '',
    commits: toNumber(phase.commitCount),
  }))
  const maxPhaseCommits = Math.max(...phaseRows.map((item) => item.commits), 1)

  const topContributors = contributors.slice(0, 6)
  const totalCommits = contributors.reduce((sum, contributor) => sum + toNumber(contributor.commits), 0)

  const milestoneTypeMap = milestones.reduce((acc, milestone) => {
    const type = String(milestone.type || 'other').toLowerCase()
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const milestoneTypeRows = Object.entries(milestoneTypeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase text-blue-900">Total Commits</p>
          <p className="mt-1 text-3xl font-bold text-blue-700">{toNumber(classification.total || data.repository?.totalCommits).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase text-green-900">Unique Contributors</p>
          <p className="mt-1 text-3xl font-bold text-green-700">{contributors.length}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-xs font-semibold uppercase text-purple-900">Phases</p>
          <p className="mt-1 text-3xl font-bold text-purple-700">{phases.length}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-semibold uppercase text-orange-900">Milestones</p>
          <p className="mt-1 text-3xl font-bold text-orange-700">{milestones.length}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Commit Type Distribution</h2>
        </div>

        {commitTypeRows.length === 0 ? (
          <p className="text-gray-500">No commit classification data available</p>
        ) : (
          <div className="space-y-3">
            {commitTypeRows.map((item) => (
              <div key={item.type}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 uppercase">{item.type}</span>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${(item.count / maxTypeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Phase Activity</h2>
        </div>

        {phaseRows.length === 0 ? (
          <p className="text-gray-500">No phase data available</p>
        ) : (
          <div className="space-y-3">
            {phaseRows.map((phase, index) => (
              <div key={`${phase.label}-${index}`}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{phase.label}</span>
                  <span className="font-semibold text-gray-900">{phase.commits} commits</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-purple-500 to-fuchsia-500"
                    style={{ width: `${(phase.commits / maxPhaseCommits) * 100}%` }}
                  />
                </div>
                {phase.period && <p className="mt-1 text-xs text-gray-500">{phase.period}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Top Contributor Share</h2>
          </div>

          {topContributors.length === 0 ? (
            <p className="text-gray-500">No contributor data available</p>
          ) : (
            <div className="space-y-3">
              {topContributors.map((contributor, index) => {
                const contributorCommits = toNumber(contributor.commits)
                const share = totalCommits > 0 ? (contributorCommits / totalCommits) * 100 : 0

                return (
                  <div key={`${contributor.name}-${index}`}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{contributor.name}</span>
                      <span className="font-semibold text-gray-900">{share.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-lime-500"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Milestone Mix</h2>
          </div>

          {milestoneTypeRows.length === 0 ? (
            <p className="text-gray-500">No milestone type data available</p>
          ) : (
            <div className="space-y-3">
              {milestoneTypeRows.map((row) => (
                <div key={row.type} className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                  <span className="text-sm font-medium capitalize text-orange-900">{row.type}</span>
                  <span className="text-sm font-bold text-orange-700">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AnalyticsPanel

import { BarChart3, PieChart, Activity, GitBranch, TrendingUp } from 'lucide-react'

function toNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function AnalyticsPanel({ data, compact = false }) {
  if (!data) {
    return <div className="text-[#6f768d] dark:text-[#7b8099]">No analytics data available</div>
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
  const totalClassified = commitTypeRows.reduce((sum, item) => sum + item.count, 0)

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

  const donutPalette = ['#6c63ff', '#00c896', '#8b84ff', '#4dcfaf', '#a2a7c0', '#7b8099']
  const donutData = commitTypeRows.slice(0, 6).map((item, index) => ({
    ...item,
    color: donutPalette[index % donutPalette.length],
  }))

  const radius = 66
  const circumference = 2 * Math.PI * radius
  let runningOffset = 0
  const donutSegments = donutData.map((item) => {
    const ratio = totalClassified > 0 ? item.count / totalClassified : 0
    const segment = {
      ...item,
      dash: `${ratio * circumference} ${circumference}`,
      offset: -runningOffset,
      percent: ratio * 100,
    }
    runningOffset += ratio * circumference
    return segment
  })

  const statCards = [
    {
      label: 'Total Commits',
      value: toNumber(classification.total || data.repository?.totalCommits).toLocaleString(),
    },
    {
      label: 'Unique Contributors',
      value: contributors.length,
    },
    {
      label: 'Phases Tracked',
      value: phases.length,
    },
    {
      label: 'Milestones',
      value: milestones.length,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f768d] dark:text-[#7b8099]">
          {compact ? 'Analytics Snapshot' : 'Graph Summary'}
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{toNumber(classification.total || data.repository?.totalCommits)}%</h2>
            <p className="text-sm text-[#6f768d] dark:text-[#7b8099]">Repository Health Index</p>
          </div>
          <div className="rounded-md border border-[#d8deea] bg-[#eef1f7] px-3 py-1 text-xs font-semibold text-[#00c896] dark:border-[#2e3142] dark:bg-[#252836]">
            Good
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6f768d] dark:text-[#7b8099]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#6c63ff]" />
          <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Commit Type Distribution</h2>
        </div>

        {commitTypeRows.length === 0 ? (
          <p className="text-[#6f768d] dark:text-[#7b8099]">No commit classification data available</p>
        ) : (
          <div className="space-y-3">
            {commitTypeRows.map((item) => (
              <div key={item.type}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium uppercase text-[#6f768d] dark:text-[#9aa0b8]">{item.type}</span>
                  <span className="font-semibold text-[#191c26] dark:text-[#eaeaf0]">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#eef1f7] dark:bg-[#252836]">
                  <div
                    className="h-full rounded-full bg-[#6c63ff]"
                    style={{ width: `${(item.count / maxTypeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div className="mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-[#6c63ff]" />
          <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Commit Mix Pie Chart</h2>
        </div>

        {donutSegments.length === 0 ? (
          <p className="text-[#6f768d] dark:text-[#7b8099]">No commit classification data available</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
            <div className="relative mx-auto h-45 w-45">
              <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
                <circle cx="90" cy="90" r={radius} fill="none" stroke="#d8deea" strokeWidth="18" className="dark:stroke-[#2e3142]" />
                {donutSegments.map((segment) => (
                  <circle
                    key={segment.type}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="18"
                    strokeDasharray={segment.dash}
                    strokeDashoffset={segment.offset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <p className="text-3xl font-semibold text-[#191c26] dark:text-[#eaeaf0]">{totalClassified}</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#6f768d] dark:text-[#7b8099]">Classified</p>
              </div>
            </div>

            <div className="space-y-2">
              {donutSegments.map((segment) => (
                <div key={segment.type} className="flex items-center justify-between rounded-lg border border-[#d8deea] bg-[#f0f3fa] px-3 py-2 dark:border-[#2e3142] dark:bg-[#252836]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-sm font-semibold uppercase text-[#191c26] dark:text-[#eaeaf0]">{segment.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">{segment.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      </div>

      <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#6c63ff]" />
          <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Phase Activity</h2>
        </div>

        {phaseRows.length === 0 ? (
          <p className="text-[#6f768d] dark:text-[#7b8099]">No phase data available</p>
        ) : (
          <div className="space-y-3">
            {phaseRows.map((phase, index) => (
              <div key={`${phase.label}-${index}`}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#6f768d] dark:text-[#9aa0b8]">{phase.label}</span>
                  <span className="font-semibold text-[#191c26] dark:text-[#eaeaf0]">{phase.commits} commits</span>
                </div>
                <div className="h-3 rounded-full bg-[#eef1f7] dark:bg-[#252836]">
                  <div
                    className="h-full rounded-full bg-[#6c63ff]"
                    style={{ width: `${(phase.commits / maxPhaseCommits) * 100}%` }}
                  />
                </div>
                {phase.period && <p className="mt-1 text-[11px] text-[#6f768d] dark:text-[#7b8099]">{phase.period}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#6c63ff]" />
            <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Top Contributor Share</h2>
          </div>

          {topContributors.length === 0 ? (
            <p className="text-[#6f768d] dark:text-[#7b8099]">No contributor data available</p>
          ) : (
            <div className="space-y-3">
              {topContributors.map((contributor, index) => {
                const contributorCommits = toNumber(contributor.commits)
                const share = totalCommits > 0 ? (contributorCommits / totalCommits) * 100 : 0

                return (
                  <div key={`${contributor.name}-${index}`}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#6f768d] dark:text-[#9aa0b8]">{contributor.name}</span>
                      <span className="font-semibold text-[#191c26] dark:text-[#eaeaf0]">{share.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#eef1f7] dark:bg-[#252836]">
                      <div
                        className="h-full rounded-full bg-[#00c896]"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-[#6c63ff]" />
            <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Milestone Mix</h2>
          </div>

          {milestoneTypeRows.length === 0 ? (
            <p className="text-[#6f768d] dark:text-[#7b8099]">No milestone type data available</p>
          ) : (
            <div className="space-y-3">
              {milestoneTypeRows.map((row) => (
                <div key={row.type} className="flex items-center justify-between rounded-lg border border-[#d8deea] bg-[#f0f3fa] px-3 py-2 dark:border-[#2e3142] dark:bg-[#252836]">
                  <span className="text-sm font-medium capitalize text-[#6f768d] dark:text-[#9aa0b8]">{row.type}</span>
                  <span className="text-sm font-semibold text-[#191c26] dark:text-[#eaeaf0]">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {!compact && (
        <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#6c63ff]" />
            <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Summary Insight</h2>
          </div>
          <p className="text-[#6f768d] dark:text-[#9aa0b8]">
            Commit activity is concentrated in <span className="font-semibold text-[#191c26] dark:text-[#eaeaf0]">{phaseRows[0]?.label || 'early phases'}</span>,
            while contributor ownership is led by <span className="font-semibold text-[#191c26] dark:text-[#eaeaf0]">{topContributors[0]?.name || 'the core team'}</span>.
            Use this view to quickly detect over-concentration and planning bottlenecks.
          </p>
        </section>
      )}
    </div>
  )
}

export default AnalyticsPanel

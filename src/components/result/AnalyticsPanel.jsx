import { Activity, Calendar, CheckCircle, Code2, TrendingUp, Users } from 'lucide-react'

function toNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function computeMonthlyActivity(phases) {
  const monthMap = {}
  let hasDateBuckets = false

  for (const phase of phases) {
    if (!phase.startDate || !phase.endDate || !phase.commitCount) continue
    const start = new Date(phase.startDate)
    const end = new Date(phase.endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue
    const startKey = start.getFullYear() * 12 + start.getMonth()
    const endKey = end.getFullYear() * 12 + end.getMonth()
    const numMonths = Math.max(endKey - startKey + 1, 1)
    const perMonth = phase.commitCount / numMonths
    hasDateBuckets = true

    for (let m = startKey; m <= endKey; m++) {
      monthMap[m] = (monthMap[m] || 0) + perMonth
    }
  }

  const rows = Object.entries(monthMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, commits]) => {
      const monthNum = Number(key)
      const year = Math.floor(monthNum / 12)
      const month = monthNum % 12
      const date = new Date(year, month, 1)
      return {
        label: date.toLocaleDateString(undefined, { month: 'short' }),
        fullLabel: date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
        commits: Math.round(commits),
      }
    })

  if (rows.length > 0) {
    return rows
  }

  // Fallback: if dates are unavailable, still show activity by phase order.
  if (!hasDateBuckets) {
    return phases
      .map((phase, index) => {
        const commits = toNumber(phase.commitCount)
        if (commits <= 0) return null
        return {
          label: `P${index + 1}`,
          fullLabel: phase.phase_name || `Phase ${index + 1}`,
          commits,
        }
      })
      .filter(Boolean)
  }

  return []
}

function AnalyticsPanel({ data }) {
  if (!data) {
    return <div className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No analytics data available</div>
  }

  const phases = Array.isArray(data.phases) ? data.phases : []
  const milestones = Array.isArray(data.milestones) ? data.milestones : []
  const classification = data.classification || {}
  const contributors = Array.isArray(data.contributors?.contributors)
    ? data.contributors.contributors
    : Array.isArray(data.contributors)
      ? data.contributors
      : []

  const totalCommits = toNumber(classification.total || data.repository?.totalCommits)
  const topContributors = contributors.slice(0, 6)
  const totalContribCommits = contributors.reduce((s, c) => s + toNumber(c.commits), 0)

  // Commit type rows with category colors
  const typeColorMap = {
    feat: 'var(--accent)',
    fix: 'var(--green)',
    refactor: 'var(--amber)',
    perf: '#3b82f6',
    chore: '#6b7280',
    test: '#10b981',
    ci: '#8b5cf6',
    docs: '#06b6d4',
    other: '#a855f7',
  }
  const commitTypeRows = Object.entries(classification)
    .filter(([key]) => key !== 'total')
    .map(([type, value]) => ({ type, count: toNumber(value), color: typeColorMap[type] || 'var(--accent)' }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
  const maxTypeCount = Math.max(...commitTypeRows.map((i) => i.count), 1)

  // Phase velocity rows
  const phasePalette = [
    { base: '#7c6af7', soft: '#a78bfa' },
    { base: '#4ade80', soft: '#86efac' },
    { base: '#fbbf24', soft: '#fcd34d' },
    { base: '#fb7185', soft: '#fda4af' },
    { base: '#3b82f6', soft: '#93c5fd' },
  ]
  const phaseRows = phases.map((phase, index) => {
    const start = phase.startDate ? new Date(phase.startDate) : null
    const end = phase.endDate ? new Date(phase.endDate) : null
    const weeks = start && end ? Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 7))) : null
    return {
      label: phase.phase_name || `Phase ${index + 1}`,
      period: phase.period || '',
      commits: toNumber(phase.commitCount),
      color: phasePalette[index % phasePalette.length],
      weeklyRate: weeks ? (phase.commitCount / weeks).toFixed(1) : null,
    }
  })
  const maxPhaseCommits = Math.max(...phaseRows.map((p) => p.commits), 1)

  // Monthly activity
  const monthlyData = computeMonthlyActivity(phases)
  const maxMonthly = Math.max(...monthlyData.map((m) => m.commits), 1)

  // Stat cards
  const startDate = phases[0]?.startDate ? new Date(phases[0].startDate) : null
  const endDate = phases[phases.length - 1]?.endDate ? new Date(phases[phases.length - 1].endDate) : null
  const durationMonths =
    startDate && endDate
      ? Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30))
      : null
  const dateRange =
    startDate && endDate
      ? `${startDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
      : ''
  const phaseFlow = phases
    .slice(0, 3)
    .map((p) => (p.phase_name || '').split(' ')[0])
    .filter(Boolean)
    .join(' → ')
  const coreCount = Array.isArray(data.contributors?.coreContributors)
    ? data.contributors.coreContributors.length
    : data.contributors?.insights?.coreTeamSize || Math.ceil(contributors.length * 0.67)
  const occasionalCount = data.contributors?.insights?.occasionalContributors || Math.max(0, contributors.length - coreCount)
  const branches = data.repository?.branches

  const statCards = [
    {
      icon: Activity,
      iconBg: 'bg-[rgba(124,106,247,0.15)] dark:bg-[rgba(124,106,247,0.15)]',
      iconColor: 'text-[var(--accent)]',
      value: totalCommits,
      label: 'Total Commits',
      sub: branches ? `across ${branches} branch${branches !== 1 ? 'es' : ''}` : 'in repository',
    },
    {
      icon: Users,
      iconBg: 'bg-[rgba(74,222,128,0.1)] dark:bg-[rgba(74,222,128,0.1)]',
      iconColor: 'text-[var(--green)]',
      value: contributors.length,
      label: 'Contributors',
      sub: `${coreCount} core · ${occasionalCount} occasional`,
    },
    {
      icon: Calendar,
      iconBg: 'bg-[rgba(251,191,36,0.1)] dark:bg-[rgba(251,191,36,0.1)]',
      iconColor: 'text-[var(--amber)]',
      value: durationMonths ? `${durationMonths}mo` : phases.length,
      label: 'Active Duration',
      sub: dateRange || 'duration unknown',
    },
    {
      icon: Code2,
      iconBg: 'bg-[rgba(251,113,133,0.1)] dark:bg-[rgba(251,113,133,0.1)]',
      iconColor: 'text-[var(--red)]',
      value: phases.length,
      label: 'Dev Phases',
      sub: phaseFlow || 'development phases',
    },
  ]

  // Health indicators
  const conventionPercent = totalCommits > 0 ? ((classification.other || 0) / totalCommits) * 100 : 0
  const busFactorPercent =
    totalContribCommits > 0 && contributors[0]
      ? (toNumber(contributors[0].commits) / totalContribCommits) * 100
      : 0
  const hasFeatures = (classification.feat || 0) + (classification.fix || 0) > 0

  const getHealthBadge = (status) => {
    if (status === 'Good' || status === 'Strong')
      return 'bg-[rgba(74,222,128,0.1)] text-[var(--green)] border border-[rgba(74,222,128,0.2)]'
    if (status === 'Monitor') return 'bg-[rgba(251,191,36,0.1)] text-[var(--amber)] border border-[rgba(251,191,36,0.2)]'
    if (status === 'Improve') return 'bg-[rgba(251,191,36,0.1)] text-[var(--amber)] border border-[rgba(251,191,36,0.2)]'
    return 'bg-[rgba(251,113,133,0.1)] text-[var(--red)] border border-[rgba(251,113,133,0.2)]'
  }

  const getHealthIcon = (status) => {
    if (status === 'Good' || status === 'Strong') return '✓'
    if (status === 'Monitor') return '⊙'
    if (status === 'Improve') return '⚠'
    return '✕'
  }

  const healthIndicators = [
    {
      title: 'Active Codebase',
      description: `${totalCommits} commits over ${durationMonths || '?'}mo with sustained contributions`,
      status: totalCommits >= 20 ? 'Good' : 'Monitor',
    },
    {
      title: 'Commit Conventions',
      description: `${Math.round(conventionPercent)}% of commits are unclassified — consider conventional commits`,
      status: conventionPercent > 70 ? 'Improve' : conventionPercent > 40 ? 'Monitor' : 'Good',
    },
    {
      title: 'Bus Factor',
      description: `~${Math.round(busFactorPercent)}% of commits from a single contributor — ${busFactorPercent > 60 ? 'moderate' : 'low'} risk`,
      status: busFactorPercent > 70 ? 'Risk' : busFactorPercent > 50 ? 'Monitor' : 'Good',
    },
    {
      title: 'Feature Growth',
      description: hasFeatures
        ? milestones
            .slice(0, 3)
            .map((m) => m.title)
            .join(', ') || 'Features shipped across phases'
        : 'Steady growth across development phases',
      status: hasFeatures || milestones.length >= 3 ? 'Strong' : 'Growing',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <p className="text-[28px] font-bold leading-none text-[var(--text-primary)] dark:text-[var(--text-primary)]">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">{card.label}</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted)]">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Commit Classification + Commit Velocity */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Commit Classification */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Commit Classification</h2>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface2)] px-2 py-0.5 text-xs text-[var(--text-secondary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-muted)]">
              {totalCommits} total
            </span>
          </div>
          {commitTypeRows.length === 0 ? (
            <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No commit classification data available</p>
          ) : (
            <div className="space-y-4">
              {commitTypeRows.map((item) => (
                <div key={item.type}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium capitalize text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                        {item.type === 'other' ? 'Other / Unclassified' : item.type}
                      </span>
                    </div>
                    <span className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface2)] dark:bg-[#1e2030]"><div className="h-full rounded-full transition-all" style={{
                        width: `${(item.count / maxTypeCount) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Commit Velocity by Phase */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Commit Velocity by Phase</h2>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface2)] px-2 py-0.5 text-xs text-[var(--text-secondary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-muted)]">
              {phases.length} phases
            </span>
          </div>
          {phaseRows.length === 0 ? (
            <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No phase data available</p>
          ) : (
            <div className="max-h-[320px] overflow-y-auto pr-1 space-y-5 scrollbar-thin scrollbar-thumb-[var(--surface3)] scrollbar-track-transparent">
              {phaseRows.map((phase, index) => (
                <div key={`${phase.label}-${index}`}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{phase.label}</span>
                    {phase.period && (
                      <span className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted)]">{phase.period}</span>
                    )}
                  </div>
                  <div className="relative h-8 overflow-hidden rounded-lg bg-[var(--surface2)] dark:bg-[var(--surface3)]">
                    <div
                      className="flex h-full items-center rounded-lg px-3 transition-all"
                      style={{
                        width: `${Math.max((phase.commits / maxPhaseCommits) * 100, 8)}%`,
                        background: `linear-gradient(90deg, ${phase.color.base}, ${phase.color.soft})`,
                      }}
                    >
                      <span className="text-xs font-bold text-white">{phase.commits}</span>
                    </div>
                  </div>
                  {phase.weeklyRate && (
                    <p className="mt-1 text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">~{phase.weeklyRate}/wk</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Monthly Activity */}
      {monthlyData.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Monthly Activity</h2>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface2)] px-2 py-0.5 text-xs text-[var(--text-secondary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-muted)]">
              {monthlyData[0]?.label} → {monthlyData[monthlyData.length - 1]?.label}
            </span>
          </div>
          <div className="overflow-x-auto pt-6 pb-6">
            <div
              className="flex items-end gap-1"
              style={{ height: '90px', minWidth: `${Math.max(monthlyData.length * 26, 300)}px` }}
            >
              {monthlyData.map((month, index) => {
                const heightPx = maxMonthly > 0 ? Math.max((month.commits / maxMonthly) * 86, 3) : 3
                const barColor = phasePalette[Math.min(Math.floor(index / 3), phasePalette.length - 1)]
                return (
                  <div
                    key={month.fullLabel}
                    className="group relative flex-1"
                    style={{ height: `${heightPx}px` }}
                  >
                    <div
                      className="absolute inset-0 rounded-t-sm transition-all"
                      style={{ background: `linear-gradient(to top, ${barColor.base}, ${barColor.soft})` }}
                      title={`${month.fullLabel}: ${month.commits} commits`}
                    />
                    {month.commits > 0 && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-[9px] font-medium text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                        {month.commits}
                      </span>
                    )}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                      {month.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contributor Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Contributor Breakdown</h2>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface2)] px-2 py-0.5 text-xs text-[var(--text-secondary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-muted)]">
              {contributors.length} authors
            </span>
          </div>
          {topContributors.length === 0 ? (
            <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No contributor data available</p>
          ) : (
            <div className="space-y-4">
              {topContributors.map((contributor, index) => {
                const commits = toNumber(contributor.commits)
                const share = totalContribCommits > 0 ? (commits / totalContribCommits) * 100 : 0
                const isCore = index < Math.max(1, coreCount)
                const avatarColor = ['var(--accent)', 'var(--green)', 'var(--amber)', 'var(--red)', '#3b82f6', '#8b5cf6'][index] || 'var(--accent)'

                return (
                  <div key={`${contributor.name}-${index}`}>
                    <div className="mb-1.5 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {(contributor.name || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)] truncate">
                            {contributor.name}
                          </span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              isCore
                                ? 'bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(124,106,247,0.2)]'
                                : 'bg-[rgba(251,191,36,0.1)] text-[var(--amber)] border border-[rgba(251,191,36,0.2)]'
                            }`}
                          >
                            {isCore ? 'Core' : 'Occasional'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                          {isCore ? (index === 0 ? 'Lead contributor · Most Active' : 'Core contributor') : 'Co-contributor · Occasional'}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">~{commits}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-[var(--surface2)] dark:bg-[#1e2030]"><div className="h-full rounded-full transition-all" style={{ width: `${share}%`, background: `linear-gradient(90deg, ${avatarColor}, ${avatarColor}88)` }}
                      />
                    </div>
                  </div>
                )
              })}
              {contributors[0] && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3 dark:border-[var(--border)] dark:bg-[var(--surface2)]">
                  <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                  <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                    {contributors[0].name} is the most active contributor, responsible for the majority of commits across all phases.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Project Health Indicators */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="mb-5 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Project Health Indicators</h2>
          </div>
          <div className="space-y-3">
            {healthIndicators.map((indicator) => (
              <div
                key={indicator.title}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[#f8faff] p-4 dark:border-[var(--surface3)] dark:bg-[#0f1220]"
              >
                <span className={`mt-0.5 text-sm font-bold ${getHealthBadge(indicator.status).split(' ')[1]}`}>
                  {getHealthIcon(indicator.status)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{indicator.title}</p>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${getHealthBadge(indicator.status)}`}
                    >
                      {indicator.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-4 text-[var(--text-secondary)] dark:text-[var(--text-muted)]">{indicator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AnalyticsPanel

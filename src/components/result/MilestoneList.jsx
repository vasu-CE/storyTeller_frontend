import { Flag, Trophy, Zap, Award, Target } from 'lucide-react'

const typeConfig = {
  launch: {
    color: 'text-indigo-600 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-900/70',
    icon: Flag
  },
  major: {
    color: 'text-purple-600 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900/70',
    icon: Trophy
  },
  feature: {
    color: 'text-blue-600 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/70',
    icon: Zap
  },
  architecture: {
    color: 'text-fuchsia-600 dark:text-fuchsia-300',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
    border: 'border-fuchsia-200 dark:border-fuchsia-900/70',
    icon: Trophy
  },
  infrastructure: {
    color: 'text-cyan-600 dark:text-cyan-300',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-900/70',
    icon: Target
  },
  quality: {
    color: 'text-emerald-600 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/70',
    icon: Award
  },
  growth: {
    color: 'text-sky-600 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-900/70',
    icon: Zap
  },
  pivot: {
    color: 'text-rose-600 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-900/70',
    icon: Trophy
  },
  security: {
    color: 'text-red-600 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-900/70',
    icon: Award
  },
  release: {
    color: 'text-green-600 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-900/70',
    icon: Flag
  },
  achievement: {
    color: 'text-orange-600 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-900/70',
    icon: Award
  },
  default: {
    color: 'text-gray-600 dark:text-slate-300',
    bg: 'bg-gray-50 dark:bg-slate-800/50',
    border: 'border-gray-200 dark:border-slate-700',
    icon: Target
  },
}

function MilestoneList({ milestones }) {
  if (!milestones || milestones.length === 0) {
    return <div className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No milestones detected</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-[22px] font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Major Milestones</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {milestones.map((milestone, index) => {
          const type = milestone.type?.toLowerCase() || 'default'
          const config = typeConfig[type] || typeConfig.default
          const Icon = config.icon

          return (
            <div
              key={index}
              className={`rounded-xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${config.border} ${config.bg}`}
            >
              <div className="border-l-[3px] border-[var(--green)] pl-4">
                {/* Header */}
                <div className="mb-3 flex items-start gap-3">
                  <div className={`rounded-lg border p-2 ${config.border} bg-[var(--surface)]/80`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="leading-tight text-[18px] font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                      {milestone.title || `Milestone ${index + 1}`}
                    </h3>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[11px] ${config.color} ${config.bg}`}>
                    {milestone.date || type}
                  </span>
                </div>

                {/* Description */}
                {milestone.description && (
                  <p className="mb-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                    {milestone.description}
                  </p>
                )}

                {/* Impact */}
                {milestone.impact && (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3 dark:border-[var(--border)] dark:bg-[var(--surface2)]">
                    <p className="mb-1 text-xs font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">Impact:</p>
                    <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{milestone.impact}</p>
                  </div>
                )}

                {/* Commits Count */}
                {milestone.commits_count && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{milestone.commits_count}</span>
                    <span>commits involved</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MilestoneList

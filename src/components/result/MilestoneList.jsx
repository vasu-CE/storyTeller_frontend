import { Flag, Trophy, Zap, Award, Target } from 'lucide-react'

const typeConfig = {
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
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            >
              <div className="border-l-[3px] border-[var(--green)] pl-4">
                {/* Header */}
                <div className="mb-3 flex items-start gap-3">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-2 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                    <Icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="leading-tight text-[18px] font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                      {milestone.title || `Milestone ${index + 1}`}
                    </h3>
                  </div>
                  <span className="rounded-md bg-[var(--surface2)] px-2 py-1 text-[11px] text-[var(--green)] dark:bg-[var(--surface3)]">
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

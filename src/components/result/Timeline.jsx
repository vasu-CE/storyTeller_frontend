import { Calendar, GitCommit, Smile, Meh, Frown, AlertCircle, CheckCircle } from 'lucide-react'

const moodConfig = {
  building: {
    color: 'text-blue-600 dark:text-blue-300',
    icon: Smile
  },
  growing: {
    color: 'text-[var(--green)]',
    icon: Smile
  },
  stabilizing: {
    color: 'text-emerald-600 dark:text-emerald-300',
    icon: CheckCircle
  },
  refactoring: {
    color: 'text-amber-600 dark:text-amber-300',
    icon: Frown
  },
  pivoting: {
    color: 'text-rose-600 dark:text-rose-300',
    icon: AlertCircle
  },
  experimenting: {
    color: 'text-violet-600 dark:text-violet-300',
    icon: AlertCircle
  },
  neutral: {
    color: 'text-[var(--text-muted)]',
    icon: Meh
  },
}

function Timeline({ phases }) {
  if (!phases || phases.length === 0) {
    return <div className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No timeline data available</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-[22px] font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Development Timeline</h2>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)] dark:bg-[var(--border)]" />

        {/* Phases */}
        <div className="space-y-8">
          {phases.map((phase, index) => {
            const mood = phase.mood?.toLowerCase() || 'neutral'
            const config = moodConfig[mood] || moodConfig.neutral
            const MoodIcon = config.icon

            return (
              <div key={index} className="relative pl-16">
                {/* Timeline Dot */}
                <div className="absolute left-4 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] bg-[var(--accent)] dark:border-[var(--bg)]" />
                </div>

                <div className="mb-2 text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                  {phase.period || 'Unknown Period'}
                </div>

                {/* Phase Card */}
                <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                        {phase.phase_name || `Phase ${index + 1}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface2)] px-3 py-1 dark:border-[var(--border)] dark:bg-[var(--surface3)]">
                      <MoodIcon className={`h-4 w-4 ${config.color}`} />
                      <span className={`text-xs font-medium ${config.color} capitalize`}>
                        {mood}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {phase.summary && (
                    <p className="mb-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{phase.summary}</p>
                  )}

                  {/* Key Activities */}
                  {phase.key_activities && phase.key_activities.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">Key Activities:</p>
                      <ul className="space-y-1">
                        {phase.key_activities.map((activity, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                            <GitCommit className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Timeline

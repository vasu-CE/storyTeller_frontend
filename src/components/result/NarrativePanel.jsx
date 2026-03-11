import { GitCommit, Users, CalendarClock } from 'lucide-react'

function NarrativePanel({ narrative, repository, contributors, phases, classification }) {
  const toArray = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean)
    }

    if (typeof value !== 'string') {
      return []
    }

    const trimmed = value.trim()
    if (!trimmed) {
      return []
    }

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [String(parsed)]
      } catch {
        return [trimmed]
      }
    }

    return [trimmed]
  }

  if (!narrative) {
    return <div className="text-[var(--text-secondary)] dark:text-[var(--text-muted)]">No narrative data available</div>
  }

  const { opening, middle_sections, turning_points, current_state, project_character } = narrative
  const middleSectionsList = toArray(middle_sections)
  const turningPointsList = toArray(turning_points)

  const contributorList = Array.isArray(contributors?.contributors)
    ? contributors.contributors
    : Array.isArray(contributors)
      ? contributors
      : []

  // Build chapters: one per phase, paired with narrative text
  const narrativeTexts = [opening, ...middleSectionsList].filter(Boolean)
  const phasesArr = Array.isArray(phases) ? phases : []

  const chapters = phasesArr.map((phase, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: phase.phase_name || `Phase ${index + 1}`,
    period: phase.period || '',
    story: narrativeTexts[index] || phase.summary || '',
    activities: Array.isArray(phase.key_activities) ? phase.key_activities : [],
  }))

  // Activity breakdown from classification
  const classDefs = [
    { label: 'Features', key: 'feat', color: 'var(--accent)' },
    { label: 'Fixes', key: 'fix', color: 'var(--green)' },
    { label: 'Refactor', key: 'refactor', color: 'var(--amber)' },
    { label: 'Docs', key: 'docs', color: '#3b82f6' },
    { label: 'Chores', key: 'chore', color: '#6b7280' },
  ]
  const total = classification?.total || 1
  const activityRows = classDefs
    .map(({ label, key, color }) => ({
      label,
      color,
      count: classification?.[key] || 0,
      percent: ((classification?.[key] || 0) / total) * 100,
    }))
    .filter((r) => r.count > 0)

  const avatarColors = ['var(--accent)', 'var(--green)', 'var(--amber)', 'var(--red)', '#3b82f6']

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      {/* Left — Chapters */}
      <div className="space-y-6">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-gradient-to-br dark:from-[var(--surface2)] dark:to-[#0f1018] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="rounded bg-[var(--accent)] px-2.5 py-1 font-mono text-xs font-bold text-white">
                  CH. {chapter.number}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] dark:text-[var(--text-primary)]">{chapter.title}</h2>
              </div>
              {chapter.period && (
                <span className="font-mono text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted)]">{chapter.period}</span>
              )}
            </div>
            {chapter.story && (
              <p className="leading-7 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{chapter.story}</p>
            )}
            {chapter.activities.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {chapter.activities.slice(0, 6).map((activity, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface2)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-secondary)]"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Turning Points */}
        {turningPointsList.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <div className="mb-5 border-b border-[var(--border)] pb-4 dark:border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Key Turning Points</h2>
            </div>
            <ul className="space-y-4">
              {turningPointsList.map((point, index) => (
                <li key={index} className="border-l-[3px] border-[var(--green)] pl-4">
                  <p className="leading-6 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current State */}
        {current_state && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <div className="mb-5 border-b border-[var(--border)] pb-4 dark:border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">Where We Are Now</h2>
            </div>
            <p className="leading-7 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{current_state}</p>
          </div>
        )}
      </div>

      {/* Right — Sidebar */}
      <div className="space-y-5 lg:sticky lg:top-32 lg:self-start">
        {/* Project Character */}
        {project_character && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
              Project Character
            </p>
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">Archetype</p>
              <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">{project_character}</h3>
              {current_state && (
                <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
                  {current_state.slice(0, 130)}
                  {current_state.length > 130 ? '…' : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Contributors */}
        {contributorList.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
              Contributors
            </p>
            <div className="space-y-3">
              {contributorList.slice(0, 5).map((contributor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
                  >
                    {(contributor.name || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">{contributor.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Breakdown */}
        {activityRows.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
              Activity Breakdown
            </p>
            <div className="space-y-3">
              {activityRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">{row.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--surface2)] dark:bg-[#1e2030]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(row.percent, 3)}%`,
                        backgroundColor: row.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NarrativePanel

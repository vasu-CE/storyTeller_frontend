import { GitCommit, Users, CalendarClock } from 'lucide-react'

function NarrativePanel({ narrative, repository, contributors, phases }) {
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
    return <div className="text-[#6f768d] dark:text-[#7b8099]">No narrative data available</div>
  }

  const { opening, middle_sections, turning_points, current_state, project_character } = narrative
  const middleSectionsList = toArray(middle_sections)
  const turningPointsList = toArray(turning_points)

  const repoName = String(repository?.url || '')
    .split('/')
    .filter(Boolean)
    .pop() || 'Repository'

  const totalCommits = repository?.totalCommits || 0
  const totalContributors = contributors?.totalContributors || contributors?.contributors?.length || 0
  const startDate = phases?.[0]?.startDate ? new Date(phases[0].startDate) : null
  const endDate = phases?.[phases.length - 1]?.endDate ? new Date(phases[phases.length - 1].endDate) : null
  const durationLabel = startDate && endDate
    ? `${startDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
    : 'N/A'

  const sectionHeading = (title) => (
    <div className="mb-4 border-b border-[#d8deea] pb-4 dark:border-[#2e3142]">
      <div className="flex items-center gap-2">
        <span className="h-1 w-1 rounded-xs bg-[#6c63ff]" />
        <h2 className="text-[20px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">{title}</h2>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div className="border-l-4 border-[#6c63ff] pl-5">
          <h1 className="text-[42px] font-bold leading-tight text-[#191c26] dark:text-[#eaeaf0]">{repoName}</h1>
          <p className="mt-2 text-sm text-[#6f768d] dark:text-[#7b8099]">AI-Generated Story of Your Codebase</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8deea] bg-[#eef1f7] px-3.5 py-1.5 text-[#191c26] dark:border-[#2e3142] dark:bg-[#252836] dark:text-[#eaeaf0]">
            <GitCommit className="h-4 w-4 text-[#6c63ff]" />
            <span className="text-sm">{totalCommits} Commits</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8deea] bg-[#eef1f7] px-3.5 py-1.5 text-[#191c26] dark:border-[#2e3142] dark:bg-[#252836] dark:text-[#eaeaf0]">
            <Users className="h-4 w-4 text-[#6c63ff]" />
            <span className="text-sm">{totalContributors} Contributors</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8deea] bg-[#eef1f7] px-3.5 py-1.5 text-[#191c26] dark:border-[#2e3142] dark:bg-[#252836] dark:text-[#eaeaf0]">
            <CalendarClock className="h-4 w-4 text-[#6c63ff]" />
            <span className="text-sm">{durationLabel}</span>
          </div>
        </div>
      </section>

      {/* Project Character Badge */}
      {project_character && (
        <div className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <div className="border-l-4 border-[#6c63ff] pl-4">
          <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c63ff]">PROJECT CHARACTER</p>
              <p className="mt-1 text-[18px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">{project_character}</p>
            </div>
          </div>
        </div>
      )}

      {/* Opening */}
      {opening && (
        <section>
          {sectionHeading('The Beginning')}
          <div className="rounded-xl border border-[#d8deea] bg-white px-6 py-5 text-[#6f768d] transition-all duration-200 hover:border-[#6c63ff] hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:text-[#9aa0b8] dark:hover:bg-[#21242f]">
            <p>{opening}</p>
          </div>
        </section>
      )}

      {/* Middle Sections */}
      {middleSectionsList.length > 0 && (
        <section>
          {sectionHeading('The Journey')}
          <div className="space-y-4">
            {middleSectionsList.map((section, index) => (
              <div key={index} className="rounded-xl border border-[#d8deea] bg-white px-6 py-5 text-[#6f768d] transition-all duration-200 hover:border-[#6c63ff] hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:text-[#9aa0b8] dark:hover:bg-[#21242f]">
                <p>{section}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Turning Points */}
      {turningPointsList.length > 0 && (
        <section>
          {sectionHeading('Key Turning Points')}
          <ul className="space-y-2">
            {turningPointsList.map((point, index) => (
              <li key={index} className="rounded-xl border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                <div className="border-l-[3px] border-[#00c896] pl-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-[#191c26] dark:text-[#eaeaf0]">Turning Point {index + 1}</p>
                    <span className="rounded-md bg-[#eef1f7] px-2 py-1 text-[11px] text-[#00c896] dark:bg-[#252836]">Point {index + 1}</span>
                  </div>
                  <p className="text-[#6f768d] dark:text-[#9aa0b8]">{point}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Current State */}
      {current_state && (
        <section>
          {sectionHeading('Where We Are Now')}
          <div className="rounded-xl border border-[#d8deea] bg-white px-6 py-5 text-[#6f768d] transition-all duration-200 hover:border-[#6c63ff] hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:text-[#9aa0b8] dark:hover:bg-[#21242f]">
            <p>{current_state}</p>
          </div>
        </section>
      )}
    </div>
  )
}

export default NarrativePanel

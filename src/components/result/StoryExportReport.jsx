function toArray(value) {
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

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return 'Unknown period'
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Unknown period'
  }

  return `${start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
}

function StoryExportReport({ repoName, repository, narrative, phases }) {
  const phaseList = Array.isArray(phases) ? phases : []
  const totalCommits = repository?.totalCommits || 0
  const opening = narrative?.opening || ''
  const foundation = narrative?.foundation_phase || ''
  const growthList = toArray(narrative?.growth_narrative).length > 0
    ? toArray(narrative?.growth_narrative)
    : toArray(narrative?.middle_sections)
  const turningPoints = toArray(narrative?.turning_points)
  const currentState = narrative?.current_state || ''

  return (
    <div className="w-[1120px] bg-[linear-gradient(170deg,#edf2ff_0%,#f7f8ff_42%,#eefaf7_100%)] p-8 text-slate-900">
      <header data-export-section className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.12)]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">GitHub Repository Story</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">{repoName || 'Repository'}</h1>
        <p className="mt-3 text-sm text-slate-600">Narrative, timeline and phases report</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">Total Commits</p>
            <p className="mt-1 text-2xl font-bold text-indigo-950">{totalCommits}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Total Phases</p>
            <p className="mt-1 text-2xl font-bold text-emerald-950">{phaseList.length}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">Generated On</p>
            <p className="mt-1 text-lg font-bold text-amber-950">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </header>

      <section data-export-section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-slate-900">Narrative</h2>
        {opening && <p className="mt-4 leading-7 text-slate-700">{opening}</p>}
        {foundation && <p className="mt-4 leading-7 text-slate-700">{foundation}</p>}
        {growthList.length > 0 && (
          <ul className="mt-4 space-y-3">
            {growthList.map((item, idx) => (
              <li key={idx} className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        )}
        {turningPoints.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-700">Turning Points</p>
            <ul className="mt-2 space-y-2">
              {turningPoints.map((point, idx) => (
                <li key={idx} className="border-l-4 border-emerald-400 pl-3 text-slate-700">{point}</li>
              ))}
            </ul>
          </div>
        )}
        {currentState && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Current State</p>
            <p className="mt-2 leading-7 text-slate-700">{currentState}</p>
          </div>
        )}
      </section>

      <section data-export-section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-slate-900">Timeline and Phases</h2>
        <div className="mt-5 space-y-4">
          {phaseList.length === 0 && (
            <p className="text-slate-600">No phases were detected for this repository.</p>
          )}
          {phaseList.map((phase, idx) => (
            <article key={idx} className="rounded-xl border border-slate-200 bg-[linear-gradient(130deg,#ffffff_0%,#f8faff_100%)] p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">{phase.phase_name || `Phase ${idx + 1}`}</h3>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {phase.mood || 'Neutral'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{phase.period || formatDateRange(phase.startDate, phase.endDate)}</p>
              {phase.summary && <p className="mt-3 text-slate-700">{phase.summary}</p>}
              {Array.isArray(phase.key_activities) && phase.key_activities.length > 0 && (
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {phase.key_activities.slice(0, 6).map((activity, activityIndex) => (
                    <li key={activityIndex} className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-sm text-slate-700">
                      {activity}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      <section data-export-section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-slate-900">Phase Summary Table</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-xs uppercase tracking-[0.1em] text-slate-600">
                <th className="px-3 py-2">Phase</th>
                <th className="px-3 py-2">Period</th>
                <th className="px-3 py-2">Commits</th>
                <th className="px-3 py-2">Mood</th>
              </tr>
            </thead>
            <tbody>
              {phaseList.map((phase, idx) => (
                <tr key={idx} className="border-t border-slate-200 bg-white text-sm text-slate-700">
                  <td className="px-3 py-2 font-medium">{phase.phase_name || `Phase ${idx + 1}`}</td>
                  <td className="px-3 py-2">{phase.period || formatDateRange(phase.startDate, phase.endDate)}</td>
                  <td className="px-3 py-2">{phase.commitCount || 0}</td>
                  <td className="px-3 py-2">{phase.mood || 'neutral'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default StoryExportReport

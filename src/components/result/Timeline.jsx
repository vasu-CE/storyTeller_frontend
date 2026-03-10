import { Calendar, GitCommit, Smile, Meh, Frown, AlertCircle } from 'lucide-react'

const moodConfig = {
  positive: {
    color: 'text-[#00c896]',
    icon: Smile
  },
  neutral: {
    color: 'text-[#7b8099]',
    icon: Meh
  },
  negative: {
    color: 'text-[#00c896]',
    icon: Frown
  },
  challenging: {
    color: 'text-[#6c63ff]',
    icon: AlertCircle
  },
}

function Timeline({ phases }) {
  if (!phases || phases.length === 0) {
    return <div className="text-[#6f768d] dark:text-[#7b8099]">No timeline data available</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-[#6c63ff]" />
        <h2 className="text-[22px] font-semibold text-[#191c26] dark:text-[#eaeaf0]">Development Timeline</h2>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#d8deea] dark:bg-[#2e3142]" />

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
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-[#f5f7fb] bg-[#6c63ff] dark:border-[#0f1117]" />
                </div>

                <div className="mb-2 text-[11px] text-[#6f768d] dark:text-[#7b8099]">
                  {phase.period || 'Unknown Period'}
                </div>

                {/* Phase Card */}
                <div className="rounded-[10px] border border-[#d8deea] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-[#191c26] dark:text-[#eaeaf0]">
                        {phase.phase_name || `Phase ${index + 1}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-[#d8deea] bg-[#eef1f7] px-3 py-1 dark:border-[#2e3142] dark:bg-[#252836]">
                      <MoodIcon className={`h-4 w-4 ${config.color}`} />
                      <span className={`text-xs font-medium ${config.color} capitalize`}>
                        {mood}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {phase.summary && (
                    <p className="mb-3 text-[#6f768d] dark:text-[#9aa0b8]">{phase.summary}</p>
                  )}

                  {/* Key Activities */}
                  {phase.key_activities && phase.key_activities.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-[#191c26] dark:text-[#eaeaf0]">Key Activities:</p>
                      <ul className="space-y-1">
                        {phase.key_activities.map((activity, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#6f768d] dark:text-[#9aa0b8]">
                            <GitCommit className="mt-0.5 h-4 w-4 shrink-0 text-[#6c63ff]" />
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

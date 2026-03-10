import { Calendar, GitCommit, Smile, Meh, Frown, AlertCircle } from 'lucide-react'

const moodConfig = {
  positive: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Smile },
  neutral: { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: Meh },
  negative: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: Frown },
  challenging: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle },
}

function Timeline({ phases }) {
  if (!phases || phases.length === 0) {
    return <div className="text-gray-500">No timeline data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Development Timeline</h2>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-200 via-blue-300 to-blue-200" />

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
                  <div className={`w-5 h-5 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                </div>

                {/* Phase Card */}
                <div className={`rounded-xl border ${config.border} ${config.bg} p-5 transition hover:shadow-md`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {phase.phase_name || `Phase ${index + 1}`}
                      </h3>
                      {phase.period && (
                        <p className="text-sm text-gray-600">{phase.period}</p>
                      )}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} border ${config.border}`}>
                      <MoodIcon className={`h-4 w-4 ${config.color}`} />
                      <span className={`text-xs font-semibold ${config.color} capitalize`}>
                        {mood}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  {phase.summary && (
                    <p className="text-gray-700 leading-relaxed mb-3">{phase.summary}</p>
                  )}

                  {/* Key Activities */}
                  {phase.key_activities && phase.key_activities.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Key Activities:</p>
                      <ul className="space-y-1">
                        {phase.key_activities.map((activity, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <GitCommit className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
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

import { Flag, Trophy, Zap, Award, Target } from 'lucide-react'

const typeConfig = {
  major: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: Trophy },
  feature: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Zap },
  release: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Flag },
  achievement: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: Award },
  default: { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: Target },
}

function MilestoneList({ milestones }) {
  if (!milestones || milestones.length === 0) {
    return <div className="text-gray-500">No milestones detected</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Major Milestones</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {milestones.map((milestone, index) => {
          const type = milestone.type?.toLowerCase() || 'default'
          const config = typeConfig[type] || typeConfig.default
          const Icon = config.icon

          return (
            <div
              key={index}
              className={`rounded-xl border ${config.border} ${config.bg} p-5 transition hover:shadow-lg hover:scale-[1.02]`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {milestone.title || `Milestone ${index + 1}`}
                  </h3>
                  {milestone.date && (
                    <p className="text-xs text-gray-600 mt-1">{milestone.date}</p>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.border} capitalize`}>
                  {type}
                </span>
              </div>

              {/* Description */}
              {milestone.description && (
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {milestone.description}
                </p>
              )}

              {/* Impact */}
              {milestone.impact && (
                <div className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Impact:</p>
                  <p className="text-xs text-gray-700">{milestone.impact}</p>
                </div>
              )}

              {/* Commits Count */}
              {milestone.commits_count && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-semibold">{milestone.commits_count}</span>
                  <span>commits involved</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MilestoneList

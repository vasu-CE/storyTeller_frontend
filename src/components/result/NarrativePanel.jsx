import { BookOpen, Sparkles, TrendingUp, Target } from 'lucide-react'

function NarrativePanel({ narrative }) {
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
    return <div className="text-gray-500">No narrative data available</div>
  }

  const { opening, middle_sections, turning_points, current_state, project_character } = narrative
  const middleSectionsList = toArray(middle_sections)
  const turningPointsList = toArray(turning_points)

  return (
    <div className="space-y-8">
      {/* Project Character Badge */}
      {project_character && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <div>
            <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">Project Character</p>
            <p className="text-lg font-bold text-purple-700">{project_character}</p>
          </div>
        </div>
      )}

      {/* Opening */}
      {opening && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">The Beginning</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">{opening}</p>
        </section>
      )}

      {/* Middle Sections */}
      {middleSectionsList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">The Journey</h2>
          </div>
          <div className="space-y-4">
            {middleSectionsList.map((section, index) => (
              <div key={index} className="pl-4 border-l-4 border-green-200">
                <p className="text-gray-700 leading-relaxed">{section}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Turning Points */}
      {turningPointsList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Key Turning Points</h2>
          </div>
          <ul className="space-y-2">
            {turningPointsList.map((point, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed flex-1">{point}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Current State */}
      {current_state && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Where We Are Now</h2>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-gray-700 leading-relaxed">{current_state}</p>
          </div>
        </section>
      )}
    </div>
  )
}

export default NarrativePanel

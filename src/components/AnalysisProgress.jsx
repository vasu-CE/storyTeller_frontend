const STEP_ORDER = ['extracting', 'chunking', 'phase', 'milestones', 'narrative', 'contributors', 'complete']

const STEP_LABELS = {
  extracting: 'Extracting',
  chunking: 'Chunking',
  phase: 'Phases',
  milestones: 'Milestones',
  narrative: 'Narrative',
  contributors: 'Contributors',
  complete: 'Complete',
}

const STEP_PROGRESS = {
  extracting: 10,
  chunking: 25,
  phase: 50,
  milestones: 75,
  narrative: 85,
  contributors: 95,
  complete: 100,
}

function getPercent(progress) {
  if (typeof progress?.percent === 'number') {
    return progress.percent
  }

  if (progress?.step === 'phase') {
    const current = Number(progress.current)
    const total = Number(progress.total)

    if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
      return Math.round((current / total) * 30) + 25
    }
  }

  return STEP_PROGRESS[progress?.step] || 0
}

function AnalysisProgress({ progress }) {
  const currentStep = progress?.step || 'extracting'
  const currentStepIndex = STEP_ORDER.indexOf(currentStep)
  const progressPercent = getPercent(progress)

  return (
    <div className="rounded-2xl border border-[#2e3142] bg-[#1a1d27] p-6 text-[#eaeaf0] shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#eaeaf0]">Analyzing Repository</h2>
          <p className="mt-2 text-[14px] text-[#9aa0b8]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {progress?.message || 'Preparing analysis...'}
          </p>
          {currentStep === 'phase' && progress?.current && progress?.total && (
            <p className="mt-1 text-[14px] text-[#7b8099]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Analyzing phase {progress.current} / {progress.total}
            </p>
          )}
        </div>

        <div
          className="shrink-0 text-[13px] font-semibold text-[#6c63ff]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {progressPercent}%
        </div>
      </div>

      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-3">
          {STEP_ORDER.map((step, index) => {
            const isCompleted = currentStepIndex > index || currentStep === 'complete'
            const isCurrent = currentStepIndex === index && currentStep !== 'complete'

            return (
              <div key={step} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    {isCurrent && <span className="absolute h-8 w-8 rounded-full border border-[#6c63ff] animate-ping" />}
                    <span
                      className={`relative h-4 w-4 rounded-full border ${
                        isCompleted
                          ? 'border-[#6c63ff] bg-[#6c63ff]'
                          : isCurrent
                            ? 'border-[#6c63ff] bg-[#1a1d27]'
                            : 'border-[#2e3142] bg-transparent'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-[#7b8099]">{STEP_LABELS[step]}</span>
                </div>
                {index < STEP_ORDER.length - 1 && <div className="h-px w-8 bg-[#2e3142]" />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-[6px] w-full overflow-hidden rounded-full border border-[#2e3142] bg-[#1a1d27]">
        <div
          className="h-full rounded-full bg-[#6c63ff] transition-[width] duration-400 ease-[ease]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

export default AnalysisProgress
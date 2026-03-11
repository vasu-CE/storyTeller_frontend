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
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--text-primary)] shadow-[0_10px_28px_rgba(26,34,56,0.1)] dark:border-[var(--border-bright)] dark:bg-[var(--surface)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[44px] leading-[1.05] font-medium text-[var(--text-primary)]">Analyzing Repository</h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            {progress?.message || 'Preparing analysis...'}
          </p>
          {currentStep === 'phase' && progress?.current && progress?.total && (
            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Analyzing phase {progress.current} / {progress.total}
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-full border border-[var(--border-bright)] bg-[var(--surface2)] px-3 py-1 font-mono text-[13px] font-semibold text-[var(--accent)]">
          {progressPercent}%
        </div>
      </div>

      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Progress</span>
          <span className="font-mono text-[12px] text-[var(--text-muted)]">{progressPercent}%</span>
        </div>
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[var(--surface3)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-400 ease-[ease]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mb-2 overflow-x-auto overflow-y-visible py-3">
        <div className="flex min-w-max items-start gap-5">
          {STEP_ORDER.map((step, index) => {
            const isCompleted = currentStepIndex > index || currentStep === 'complete'
            const isCurrent = currentStepIndex === index && currentStep !== 'complete'

            return (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex h-9 w-9 items-center justify-center">
                    {isCurrent && <span className="absolute -inset-1 rounded-full border border-[var(--accent)] opacity-70 animate-ping" />}
                    <span
                      className={`relative h-4 w-4 rounded-full border ${
                        isCompleted
                          ? 'border-[var(--green)] bg-[var(--green)]'
                          : isCurrent
                            ? 'border-[var(--accent)] bg-[var(--surface)] shadow-[0_0_0_4px_rgba(124,106,247,0.18)]'
                            : 'border-[var(--border)] bg-transparent'
                      }`}
                    />
                  </div>
                  <span className={`text-xs ${isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{STEP_LABELS[step]}</span>
                </div>
                {index < STEP_ORDER.length - 1 && <div className="h-px w-10 bg-[var(--border)]" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnalysisProgress
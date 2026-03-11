import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, BookOpen, Calendar, Clock, GitCommit, MessageSquare, Milestone, Users } from 'lucide-react'
import NarrativePanel from '../components/result/NarrativePanel'
import Timeline from '../components/result/Timeline'
import MilestoneList from '../components/result/MilestoneList'
import ContributorPanel from '../components/result/ContributorPanel'
import AnalyticsPanel from '../components/result/AnalyticsPanel'
import ChatPanel from '../components/ChatPanel'
import { Button } from '../components/ui/button'

const tabs = [
  { id: 'narrative', label: 'Narrative', icon: BookOpen },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'milestones', label: 'Milestones', icon: Milestone },
  { id: 'contributors', label: 'Contributors', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

function getRepoName(repoUrl) {
  const normalized = String(repoUrl || '').trim().replace(/\.git$/i, '')

  if (!normalized) {
    return 'this repository'
  }

  return normalized
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/^https?:\/\/(www\.)?gitlab\.com\//i, '')
}

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('narrative')

  const data = location.state?.data
  const repoUrl = location.state?.repoUrl || data?.repository?.url || data?.repoMeta?.url || ''

  if (!data) {
    navigate('/')
    return null
  }

  const { narrative, phases, milestones, contributors, sessionId } = data
  const repoName = getRepoName(repoUrl)
  const repoShortName = repoName.split('/').pop() || repoName

  // Compute header stats
  const totalCommits = data.repository?.totalCommits || 0
  const totalContributors =
    contributors?.totalContributors ||
    (Array.isArray(contributors?.contributors) ? contributors.contributors.length : 0)
  const startDate = phases?.[0]?.startDate ? new Date(phases[0].startDate) : null
  const endDate = phases?.[phases.length - 1]?.endDate ? new Date(phases[phases.length - 1].endDate) : null
  const durationMonths =
    startDate && endDate
      ? Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30))
      : null
  const durationLabel = durationMonths ? `${durationMonths}mo` : 'N/A'
  const dateRangeLabel =
    startDate && endDate
      ? `${startDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} – ${endDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
      : ''

  const projectCharacter = narrative?.project_character || ''

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-secondary)] dark:bg-[var(--bg)] dark:text-[var(--text-secondary)]">
      {/* Sticky Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md dark:border-[var(--surface3)] dark:bg-[var(--bg)]/95">
        <div className="flex items-center gap-3 px-6 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface3)] dark:border-[var(--surface3)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze Another Repository
          </Button>
          {/* <div className="flex min-w-0 flex-1 items-center truncate rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-4 py-2 dark:border-[var(--surface3)] dark:bg-[var(--surface2)]"> */}
            <span className="truncate text-sm text-blue-600 cursor-pointer" onClick={() => window.open(repoUrl, '_blank')}>
              {repoUrl}
            </span>
          {/* </div> */}
        </div>
      </div>

      {/* Main container — full width */}
      <div className="flex w-full gap-0">
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:shrink-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto px-4 pt-6 pb-8">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 pb-7 pt-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Repository Story</p>
              <h1 className="text-[36px] font-bold leading-tight text-[var(--text-primary)] dark:text-[var(--text-primary)] break-words">
                {repoShortName}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-muted)]">AI-Generated Story of Your Codebase</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { value: totalCommits, label: 'COMMITS' },
                  { value: totalContributors, label: 'AUTHORS' },
                  { value: durationLabel, label: 'LIFESPAN' },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-3 text-center dark:border-[var(--surface3)] dark:bg-[var(--surface3)]">
                    <p className="text-xl font-semibold leading-none text-[var(--text-primary)]">{value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface2)] px-3 py-1.5 text-sm text-[var(--text-primary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-primary)]">
                  <GitCommit className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {totalCommits} Commits
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface2)] px-3 py-1.5 text-sm text-[var(--text-primary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-primary)]">
                  <Users className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {totalContributors} Contributors
                </span>
                {dateRangeLabel && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface2)] px-3 py-1.5 text-sm text-[var(--text-primary)] dark:border-[var(--surface3)] dark:bg-[var(--surface3)] dark:text-[var(--text-primary)]">
                    <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {dateRangeLabel}
                  </span>
                )}
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="sticky top-14 z-40 mb-8 border-b border-[var(--border)] bg-[var(--bg)] dark:border-[var(--surface3)] dark:bg-[var(--bg)]">
              <div className="flex ">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-medium transition border-b-2 -mb-[2px] ${
                      activeTab === tab.id
                        ? 'border-[var(--accent)] bg-[#f0f3ff] text-[#2f266d] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted)] dark:hover:bg-[var(--surface3)] dark:hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div>
          {activeTab === 'narrative' && (
            <NarrativePanel
              narrative={narrative}
              repository={data.repository}
              contributors={contributors}
              phases={phases}
              classification={data.classification}
            />
          )}
          {activeTab === 'timeline' && <Timeline phases={phases} />}
          {activeTab === 'milestones' && <MilestoneList milestones={milestones} />}
          {activeTab === 'contributors' && <ContributorPanel contributors={contributors} />}
          {activeTab === 'chat' && (
            sessionId ? (
              <ChatPanel
                sessionId={sessionId}
                repoName={repoName}
                projectCharacter={projectCharacter}
                span={dateRangeLabel}
                totalCommits={totalCommits}
                totalContributors={totalContributors}
              />
            ) : (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-6 text-[var(--text-primary)] dark:border-[var(--border)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]">
                Analysis session expired. Please re-analyze the repository.
              </div>
            )
          )}
          {activeTab === 'analytics' && <AnalyticsPanel data={data} />}
            </div>
          </section>
        </div>
    </div>
  )
}

export default ResultPage

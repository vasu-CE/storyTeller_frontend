import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, BookOpen, Clock, MessageSquare, Milestone, Users } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 pb-12 pt-6 text-[#6f768d] dark:bg-[#0f1117] dark:text-[#9aa0b8]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="rounded-lg border border-[#d8deea] bg-white px-4 py-2 text-[#191c26] hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:text-[#eaeaf0] dark:hover:bg-[#21242f]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Analyze Another Repository
            </Button>
          </div>

          <div className="rounded-xl border border-[#d8deea] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <h1 className="mb-2 text-3xl font-bold text-[#191c26] dark:text-[#eaeaf0]">Repository Story</h1>
            <p className="break-all text-sm text-[#6f768d] dark:text-[#7b8099]">{repoUrl}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-50 mb-6 border-b border-[#d8deea] bg-[#f5f7fb] py-2 dark:border-[#2e3142] dark:bg-[#0f1117]">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'border-[#6c63ff] bg-[#6c63ff] text-white'
                    : 'border-transparent bg-transparent text-[#6f768d] hover:border-[#d8deea] hover:bg-white hover:text-[#191c26] dark:text-[#7b8099] dark:hover:border-[#2e3142] dark:hover:bg-[#1a1d27] dark:hover:text-[#eaeaf0]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-[#d8deea] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          {activeTab === 'narrative' && (
            <NarrativePanel
              narrative={narrative}
              repository={data.repository}
              contributors={contributors}
              phases={phases}
            />
          )}
          {activeTab === 'timeline' && <Timeline phases={phases} />}
          {activeTab === 'milestones' && <MilestoneList milestones={milestones} />}
          {activeTab === 'contributors' && <ContributorPanel contributors={contributors} />}
          {activeTab === 'chat' && (
            sessionId ? (
              <ChatPanel sessionId={sessionId} repoName={repoName} />
            ) : (
              <div className="rounded-xl border border-[#d8deea] bg-[#f8f9fc] p-6 text-[#191c26] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0]">
                Analysis session expired. Please re-analyze the repository.
              </div>
            )
          )}
          {activeTab === 'analytics' && <AnalyticsPanel data={data} compact />}
        </div>
      </div>
    </div>
  )
}

export default ResultPage

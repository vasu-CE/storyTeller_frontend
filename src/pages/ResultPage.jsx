import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, BookOpen, Clock, Milestone, Users } from 'lucide-react'
import NarrativePanel from '../components/result/NarrativePanel'
import Timeline from '../components/result/Timeline'
import MilestoneList from '../components/result/MilestoneList'
import ContributorPanel from '../components/result/ContributorPanel'
import AnalyticsPanel from '../components/result/AnalyticsPanel'
import { Button } from '../components/ui/button'

const tabs = [
  { id: 'narrative', label: 'Narrative', icon: BookOpen },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'milestones', label: 'Milestones', icon: Milestone },
  { id: 'contributors', label: 'Contributors', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('narrative')

  const data = location.state?.data
  const repoUrl = location.state?.repoUrl

  if (!data) {
    navigate('/')
    return null
  }

  const { narrative, phases, milestones, contributors } = data

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze Another Repository
          </Button>

          <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Repository Story
            </h1>
            <p className="text-gray-600 text-sm break-all">{repoUrl}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white rounded-t-2xl p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur p-8">
          {activeTab === 'narrative' && <NarrativePanel narrative={narrative} />}
          {activeTab === 'timeline' && <Timeline phases={phases} />}
          {activeTab === 'milestones' && <MilestoneList milestones={milestones} />}
          {activeTab === 'contributors' && <ContributorPanel contributors={contributors} />}
          {activeTab === 'analytics' && <AnalyticsPanel data={data} />}
        </div>
      </div>
    </div>
  )
}

export default ResultPage

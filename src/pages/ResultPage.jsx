import { useState } from 'react'
import jsPDF from 'jspdf'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, BarChart3, BookOpen, Calendar, CheckCircle2, Clock, Download, GitCommit, LoaderCircle, MessageSquare, Milestone, Moon, RefreshCw, Sun, Users } from 'lucide-react'
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

function ResultPage({ theme = 'light', onToggleTheme = () => {} }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('narrative')
  const [isExportingStory, setIsExportingStory] = useState(false)

  const data = location.state?.data
  const repoUrl = location.state?.repoUrl || data?.repository?.url || data?.repoMeta?.url || ''

  if (!data) {
    navigate('/')
    return null
  }

  const { narrative, phases, milestones, contributors, sessionId } = data
  const repoName = getRepoName(repoUrl)
  const repoShortName = repoName.split('/').pop() || repoName
  const cache = data.cache || null
  const isStale = cache?.syncStatus === 'stale'
  const analysisSource = cache?.source === 'database' ? 'Loaded from database' : 'Fresh analysis'
  const analyzedAtLabel = cache?.analyzedAt
    ? new Date(cache.analyzedAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Unknown'

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

  const toStoryArray = (value) => {
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

  const sanitizeStoryText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

  const formatPhasePeriod = (phase) => {
    if (phase?.period) return phase.period
    if (!phase?.startDate && !phase?.endDate) return 'Unknown period'

    const start = phase?.startDate ? new Date(phase.startDate) : null
    const end = phase?.endDate ? new Date(phase.endDate) : null

    if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Unknown period'
    }

    return `${start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
  }

  const handleExportStoryPdf = async () => {
    if (isExportingStory) {
      return
    }

    setIsExportingStory(true)

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 12
      const contentWidth = pageWidth - margin * 2
      let cursorY = margin

      const brand = {
        navy: [15, 23, 42],
        blue: [37, 99, 235],
        cyan: [14, 165, 233],
        emerald: [5, 150, 105],
        violet: [109, 40, 217],
        slate: [71, 85, 105],
        light: [241, 245, 249],
      }

      const ensureSpace = (neededHeight = 8) => {
        if (cursorY + neededHeight > pageHeight - margin) {
          pdf.addPage()
          cursorY = margin
        }
      }

      const writeWrappedText = (text, opts = {}) => {
        const {
          size = 11,
          lineHeight = 5.2,
          color = [51, 65, 85],
          indent = 0,
          bold = false,
          spacingAfter = 2,
        } = opts

        const safe = sanitizeStoryText(text)
        if (!safe) return

        const x = margin + indent
        const width = contentWidth - indent
        const lines = pdf.splitTextToSize(safe, width)

        pdf.setFont('helvetica', bold ? 'bold' : 'normal')
        pdf.setFontSize(size)
        pdf.setTextColor(color[0], color[1], color[2])

        for (const line of lines) {
          ensureSpace(lineHeight)
          pdf.text(line, x, cursorY)
          cursorY += lineHeight
        }

        cursorY += spacingAfter
      }

      const drawFooter = (pageNo) => {
        pdf.setDrawColor(226, 232, 240)
        pdf.line(margin, pageHeight - 8, pageWidth - margin, pageHeight - 8)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8.5)
        pdf.setTextColor(100, 116, 139)
        pdf.text('Story Teller Report', margin, pageHeight - 4.5)
        pdf.text(`Page ${pageNo}`, pageWidth - margin - 12, pageHeight - 4.5)
      }

      const drawSectionTitle = (title, fill = [79, 70, 229]) => {
        ensureSpace(12)
        pdf.setFillColor(fill[0], fill[1], fill[2])
        pdf.roundedRect(margin, cursorY - 4, contentWidth, 9, 2, 2, 'F')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.setTextColor(255, 255, 255)
        pdf.text(title, margin + 3, cursorY + 1.5)
        cursorY += 10
      }

      const drawTopHeader = () => {
        const headerTop = cursorY - 2
        const headerHeight = 42

        pdf.setFillColor(248, 250, 252)
        pdf.roundedRect(margin, headerTop, contentWidth, headerHeight, 4, 4, 'F')
        pdf.setDrawColor(203, 213, 225)
        pdf.roundedRect(margin, headerTop, contentWidth, headerHeight, 4, 4, 'S')

        pdf.setFillColor(37, 99, 235)
        pdf.roundedRect(margin + 2.5, headerTop + 2.5, contentWidth - 5, 19, 3, 3, 'F')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(18)
        pdf.setTextColor(255, 255, 255)
        pdf.text(repoShortName || 'Repository Story', margin + 6, headerTop + 9.8)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9.5)
        pdf.text(`Generated ${new Date().toLocaleDateString()}`, margin + 6, headerTop + 15.2)

        const metaText = `${totalCommits} commits | ${Array.isArray(phases) ? phases.length : 0} phases | ${dateRangeLabel || 'Date range unavailable'}`
        const metaLines = pdf.splitTextToSize(metaText, contentWidth - 14)
        pdf.text(metaLines[0] || '', margin + 6, headerTop + 19.2)

        cursorY = headerTop + 24

        const cards = [
          { label: 'COMMITS', value: String(totalCommits), fill: [219, 234, 254], text: brand.blue },
          { label: 'PHASES', value: String(Array.isArray(phases) ? phases.length : 0), fill: [209, 250, 229], text: brand.emerald },
          { label: 'DURATION', value: durationLabel, fill: [237, 233, 254], text: brand.violet },
        ]
        const cardGap = 3.5
        const cardWidth = (contentWidth - cardGap * 2) / 3
        const cardHeight = 14

        for (let i = 0; i < cards.length; i += 1) {
          const cardX = margin + i * (cardWidth + cardGap)
          const card = cards[i]
          pdf.setFillColor(card.fill[0], card.fill[1], card.fill[2])
          pdf.roundedRect(cardX, cursorY, cardWidth, cardHeight, 2, 2, 'F')
          pdf.setDrawColor(203, 213, 225)
          pdf.roundedRect(cardX, cursorY, cardWidth, cardHeight, 2, 2, 'S')
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(7.8)
          pdf.setTextColor(card.text[0], card.text[1], card.text[2])
          pdf.text(card.label, cardX + 2, cursorY + 4.6)
          pdf.setFontSize(11.4)
          pdf.text(card.value, cardX + 2, cursorY + 10.8)
        }

        cursorY += 18
      }

      drawTopHeader()

      const growthList = toStoryArray(narrative?.growth_narrative).length > 0
        ? toStoryArray(narrative?.growth_narrative)
        : toStoryArray(narrative?.middle_sections)
      const turningPoints = toStoryArray(narrative?.turning_points)

      drawSectionTitle('Narrative', [59, 130, 246])
      writeWrappedText(narrative?.opening, { size: 11.5, lineHeight: 5.4 })
      writeWrappedText(narrative?.foundation_phase)

      for (const paragraph of growthList) {
        writeWrappedText(paragraph)
      }

      if (turningPoints.length > 0) {
        writeWrappedText('Turning Points', { bold: true, size: 11, color: [79, 70, 229], spacingAfter: 1 })
        for (const point of turningPoints) {
          ensureSpace(7)
          pdf.setFillColor(224, 231, 255)
          pdf.roundedRect(margin, cursorY - 3.2, contentWidth, 6, 1.5, 1.5, 'F')
          writeWrappedText(`- ${point}`, { indent: 2, size: 10.5, lineHeight: 5, spacingAfter: 0.8, color: brand.navy })
        }
      }

      writeWrappedText(narrative?.current_state, { spacingAfter: 3 })

      drawSectionTitle('Timeline and Phases', [22, 163, 74])
      const phaseList = Array.isArray(phases) ? phases : []

      if (phaseList.length === 0) {
        writeWrappedText('No phases were detected for this repository.', { color: [100, 116, 139] })
      }

      for (let index = 0; index < phaseList.length; index += 1) {
        const phase = phaseList[index]
        const phaseTitle = phase?.phase_name || `Phase ${index + 1}`
        const phasePeriod = formatPhasePeriod(phase)
        const mood = phase?.mood || 'neutral'

        ensureSpace(24)
        pdf.setFillColor(248, 250, 252)
        pdf.setDrawColor(203, 213, 225)
        pdf.roundedRect(margin, cursorY - 4, contentWidth, 14, 2, 2, 'FD')
        pdf.setFillColor(59, 130, 246)
        pdf.roundedRect(margin, cursorY - 4, 2, 14, 1, 1, 'F')

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(11.5)
        pdf.setTextColor(15, 23, 42)
        pdf.text(phaseTitle, margin + 4, cursorY + 1.8)

        pdf.setFillColor(226, 232, 240)
        pdf.roundedRect(pageWidth - margin - 30, cursorY - 1.6, 28, 5, 1.5, 1.5, 'F')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8.5)
        pdf.setTextColor(51, 65, 85)
        pdf.text(`mood: ${mood}`, pageWidth - margin - 27.5, cursorY + 1.5)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(71, 85, 105)
        const phaseMeta = `${phasePeriod} | commits: ${phase?.commitCount || 0}`
        pdf.text(phaseMeta, margin + 4, cursorY + 7.4)
        cursorY += 14

        writeWrappedText(phase?.summary, { size: 10.5, lineHeight: 4.8, spacingAfter: 1.4 })

        const activities = Array.isArray(phase?.key_activities) ? phase.key_activities.slice(0, 6) : []
        for (const activity of activities) {
          writeWrappedText(`• ${activity}`, { indent: 3, size: 10, lineHeight: 4.8, spacingAfter: 0.6, color: [30, 41, 59] })
        }

        cursorY += 1.5
      }

      drawSectionTitle('Phase Summary', [14, 165, 233])
      ensureSpace(12)
      const headers = ['Phase', 'Period', 'Commits', 'Mood']
      const widths = [56, 78, 22, 20]
      let x = margin
      pdf.setFillColor(226, 232, 240)
      pdf.roundedRect(margin, cursorY - 3, contentWidth, 8, 1.5, 1.5, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9.2)
      pdf.setTextColor(30, 41, 59)
      headers.forEach((header, i) => {
        pdf.text(header, x + 1.5, cursorY + 1.8)
        x += widths[i]
      })
      cursorY += 8

      for (let index = 0; index < phaseList.length; index += 1) {
        const phase = phaseList[index]
        ensureSpace(7)
        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252)
          pdf.rect(margin, cursorY - 2.6, contentWidth, 6.2, 'F')
        }

        const rowValues = [
          phase?.phase_name || `Phase ${index + 1}`,
          formatPhasePeriod(phase),
          String(phase?.commitCount || 0),
          phase?.mood || 'neutral',
        ]

        x = margin
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8.8)
        pdf.setTextColor(51, 65, 85)
        rowValues.forEach((value, i) => {
          const colText = pdf.splitTextToSize(String(value), widths[i] - 3)
          pdf.text(colText[0] || '', x + 1.5, cursorY + 1.4)
          x += widths[i]
        })

        cursorY += 6.4
      }

      const totalPages = pdf.getNumberOfPages()
      for (let page = 1; page <= totalPages; page += 1) {
        pdf.setPage(page)
        drawFooter(page)
      }

      const safeRepo = (repoShortName || 'repository-story').replace(/[^a-z0-9-_]/gi, '-').toLowerCase()
      const dateStamp = new Date().toISOString().slice(0, 10)
      pdf.save(`${safeRepo}-story-${dateStamp}.pdf`)
    } catch (error) {
      console.error('Failed to export story PDF:', error)
      window.alert('Unable to export story PDF. Please try again.')
    } finally {
      setIsExportingStory(false)
    }
  }

  return (
    <div className="result-page min-h-screen bg-[var(--bg)] text-[var(--text-secondary)] dark:bg-[var(--bg)] dark:text-[var(--text-secondary)]">
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
            <span className="truncate text-sm text-blue-600 dark:text-blue-300 cursor-pointer" onClick={() => window.open(repoUrl, '_blank')}>
              {repoUrl}
            </span>
            <div className="ml-auto flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleTheme}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface3)]"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  isStale
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
                }`}
              >
                {isStale ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {isStale ? 'Out of sync' : 'Synchronized'}
              </span>
              <Button
                variant="outline"
                onClick={() => navigate('/analyzing', { state: { repoUrl, forceSync: true } })}
                className="rounded-lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchronize
              </Button>
              <Button
                variant="default"
                onClick={handleExportStoryPdf}
                disabled={isExportingStory}
                className="rounded-lg"
              >
                {isExportingStory ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isExportingStory ? 'Exporting Story...' : 'Export Story PDF'}
              </Button>
            </div>
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

              {/* Analysis source banner */}
              <div className={`mt-5 rounded-xl border px-4 py-3 text-xs ${
                isStale
                  ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100'
              }`}>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm">{analysisSource}</span>
                  <span>Last analyzed: {analyzedAtLabel}</span>
                  {cache?.latestHeadHash && cache?.analyzedHeadHash && isStale && (
                    <span className="break-all mt-1">Stored HEAD {cache.analyzedHeadHash.slice(0, 8)} is behind remote HEAD {cache.latestHeadHash.slice(0, 8)}.</span>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className=" flex-1 pr-4">

            {/* Tabs */}
            <div className="sticky top-14 z-40 mb-4 border-b border-[var(--border)] bg-[var(--bg)] dark:border-[var(--surface3)] dark:bg-[var(--bg)]">
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

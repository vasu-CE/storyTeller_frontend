import { useEffect, useRef, useState } from 'react'
import { MessageSquare, RotateCcw, SendHorizontal } from 'lucide-react'
import { sendChatMessage } from '../services/api'
import { Button } from './ui/button'

const STARTER_QUESTIONS = [
  'Who contributed the most to this project?',
  'What were the major turning points?',
  'What features were added in each phase?',
  'How has the codebase evolved over time?',
]

function normalizeChatError(message) {
  const text = String(message || '')

  if (/session not found|session expired/i.test(text)) {
    return 'Your session has expired. Please re-run the analysis.'
  }

  if (/temporarily unavailable|request failed|too many chat requests/i.test(text)) {
    return text.includes('Too many chat requests')
      ? text
      : 'AI is temporarily unavailable. Please try again.'
  }

  return text || 'Request failed'
}

function ChatPanel({ sessionId, repoName, projectCharacter, span, totalCommits, totalContributors }) {
  const projectShortName = repoName?.split('/')?.pop() || repoName || 'this repository'

  const getInitialMessage = () => ({
    id: 0,
    role: 'assistant',
    content:
      projectShortName && projectShortName !== 'this repository'
        ? `Hello! I've analyzed the **${projectShortName}** repository${
            projectCharacter ? ` — ${projectCharacter.toLowerCase()}` : ''
          }${
            totalCommits && totalContributors
              ? ` built with ${totalCommits} commits by a team of ${totalContributors}`
              : totalCommits
                ? ` with ${totalCommits} commits`
                : ''
          }. I can answer questions about the codebase, contributors, phases, features, and the project's journey.\n\nWhat would you like to know?`
        : 'Ask me anything about this repository!',
  })

  const [messages, setMessages] = useState(() => [getInitialMessage()])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const nextIdRef = useRef(1)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  const handleClear = () => {
    if (messages.length > 3 && !window.confirm('Clear this chat history?')) {
      return
    }

    setMessages([getInitialMessage()])
    setInputValue('')
    setError(null)
    setIsLoading(false)
    nextIdRef.current = 1
  }

  const handleSend = async (overrideMessage) => {
    if (isLoading) {
      return
    }

    const userMessageText = String(overrideMessage ?? inputValue).trim()

    if (!userMessageText) {
      return
    }

    if (userMessageText.length > 1000) {
      setError('Message must be 1000 characters or fewer.')
      return
    }

    const history = messages.map(({ role, content }) => ({ role, content }))
    const userMessage = {
      id: nextIdRef.current++,
      role: 'user',
      content: userMessageText,
    }

    setMessages((current) => [...current, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      const reply = await sendChatMessage(sessionId, userMessageText, history)
      setMessages((current) => [
        ...current,
        {
          id: nextIdRef.current++,
          role: 'assistant',
          content: reply || 'I do not have a response right now.',
        },
      ])
    } catch (requestError) {
      setError(normalizeChatError(requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  const isChatEmpty = messages.length === 1 && messages[0]?.role === 'assistant'
  const characterCount = inputValue.length
  const isTooLong = characterCount > 1000

  const contextItems = [
    { label: 'PROJECT', value: projectShortName },
    { label: 'CHARACTER', value: projectCharacter || 'N/A' },
    { label: 'SPAN', value: span || 'N/A' },
    {
      label: 'COMMITS',
      value:
        totalCommits && totalContributors
          ? `${totalCommits} across ${totalContributors} contributors`
          : totalCommits
            ? String(totalCommits)
            : 'N/A',
    },
  ]

  return (
    <div className="flex h-[calc(100vh-230px)] min-h-150 gap-6">
      {/* Left Sidebar */}
      <div className="hidden w-72 shrink-0 space-y-4 overflow-y-auto lg:flex lg:flex-col">
        {/* Repo Context */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 dark:border-[var(--surface3)] dark:bg-[var(--surface)]">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
            Repo Context
          </p>
          <div className="space-y-2.5">
            {contextItems.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3 dark:border-[var(--surface3)] dark:bg-[var(--surface2)]"
              >
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">{label}</p>
                <p className="truncate text-sm font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 dark:border-[var(--surface3)] dark:bg-[var(--surface)]">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] dark:text-[var(--text-muted)]">
            Suggested Questions
          </p>
          <div className="space-y-2">
            {STARTER_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleSend(question)}
                disabled={isLoading}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3 text-left text-sm text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:bg-[var(--surface3)] disabled:opacity-50 dark:border-[var(--surface3)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Chat Panel */}
      <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[var(--surface3)] dark:bg-[var(--surface)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        {/* Chat Header */}
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4 dark:border-[var(--surface3)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface2)] text-[var(--accent)] dark:bg-[var(--surface3)]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Repository Chat</p>
              <h2 className="text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                Chat with {projectShortName}
              </h2>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--surface3)] dark:border-[var(--surface3)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface3)]"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Clear
          </Button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-5">
            {messages.map((message) => {
              const isUser = message.role === 'user'

              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface2)] text-[var(--accent)] dark:bg-[var(--surface3)]">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? 'bg-[var(--accent)] text-white'
                        : 'border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-primary)] dark:border-[var(--surface3)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface2)] text-[var(--accent)] dark:bg-[var(--surface3)]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 dark:border-[var(--surface3)] dark:bg-[var(--surface2)]">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Footer note on mobile: show suggested questions inline */}
        {isChatEmpty && !isLoading && (
          <div className="border-t border-[var(--border)] px-5 py-3 dark:border-[var(--surface3)] lg:hidden">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.slice(0, 3).map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface2)] px-3 py-1.5 text-xs text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:bg-[var(--surface3)] dark:border-[var(--surface3)] dark:bg-[var(--surface2)] dark:text-[var(--text-primary)]"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-[var(--border)] px-5 py-4 dark:border-[var(--surface3)]">
          <div className="flex items-end gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 focus-within:border-[var(--accent)] dark:border-[var(--surface3)] dark:bg-[var(--surface2)] dark:focus-within:border-[var(--accent)]">
            <textarea
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value)
                if (error) setError(null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend()
                }
              }}
              placeholder="Ask anything about this repository..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] dark:text-[var(--text-primary)]"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={() => void handleSend()}
              disabled={!inputValue.trim() || isLoading || isTooLong}
              className="shrink-0 rounded-lg bg-[var(--accent)] p-2 text-white hover:bg-[#6d5ce7] disabled:opacity-40"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1">
            <p className="text-[11px] text-[var(--text-muted)]">Powered by AI · {projectShortName} repo analysis</p>
            <p className={`text-[11px] ${isTooLong ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
              {characterCount}/1000
            </p>
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </section>
    </div>
  )
}

export default ChatPanel

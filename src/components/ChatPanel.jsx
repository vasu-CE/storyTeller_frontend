import { useEffect, useRef, useState } from 'react'
import { MessageSquare, RotateCcw, SendHorizontal } from 'lucide-react'
import { sendChatMessage } from '../services/api'
import { Button } from './ui/button'

const STARTER_QUESTIONS = [
  'When did this project start?',
  'Who contributed the most?',
  'What were the major milestones?',
  'What was the biggest refactor?'
]

const INITIAL_MESSAGE = {
  id: 0,
  role: 'assistant',
  content: 'Ask me anything about this repository!'
}

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

function ChatPanel({ sessionId, repoName }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
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

    setMessages([INITIAL_MESSAGE])
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
      content: userMessageText
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
          content: reply || 'I do not have a response right now.'
        }
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

  return (
    <section className="flex h-[70vh] min-h-135 flex-col rounded-2xl border border-[#d8deea] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:border-[#2e3142] dark:bg-[#1a1d27] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <header className="flex items-center justify-between gap-3 border-b border-[#d8deea] px-5 py-4 dark:border-[#2e3142]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1f7] text-[#6c63ff] dark:bg-[#252836]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8099]">Repository Chat</p>
            <h2 className="text-lg font-semibold text-[#191c26] dark:text-[#eaeaf0]">Chat with {repoName || 'this repository'}</h2>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleClear}
          className="rounded-lg border border-[#d8deea] bg-white px-3 py-2 text-[#191c26] hover:bg-[#f0f3fa] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0] dark:hover:bg-[#252836]"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.role === 'user'

            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-[#6c63ff] text-white'
                      : 'border border-[#d8deea] bg-[#f8f9fc] text-[#191c26] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0]'
                  }`}
                >
                  <p className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${isUser ? 'text-white/75' : 'text-[#7b8099]'}`}>
                    {isUser ? '' : 'Assistant'}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-[#d8deea] bg-[#f8f9fc] px-4 py-3 text-[#191c26] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0]">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7b8099]">Assistant</p>
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#6c63ff] [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#6c63ff] [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#6c63ff] [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}

          {isChatEmpty && !isLoading && (
            <div className="flex flex-wrap gap-2 pt-2">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="rounded-full border border-[#d8deea] bg-[#f8f9fc] px-3 py-2 text-sm text-[#191c26] transition hover:border-[#6c63ff] hover:bg-[#eef1ff] dark:border-[#2e3142] dark:bg-[#21242f] dark:text-[#eaeaf0] dark:hover:bg-[#252836]"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-[#d8deea] px-5 py-4 dark:border-[#2e3142]">
        <div className="rounded-2xl border border-[#d8deea] bg-[#f8f9fc] p-3 dark:border-[#2e3142] dark:bg-[#21242f]">
          <textarea
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
              if (error) {
                setError(null)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void handleSend()
              }
            }}
            placeholder="Ask about milestones, contributors, timelines, or project health..."
            className="h-5 w-full resize-none bg-transparent text-sm  text-[#191c26] outline-none placeholder:text-[#7b8099] dark:text-[#eaeaf0]"
            disabled={isLoading}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className={`text-xs ${isTooLong ? 'text-red-500' : 'text-[#7b8099]'}`}>
                {characterCount}/1000
              </p>
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <Button
              type="button"
              onClick={() => void handleSend()}
              disabled={!inputValue.trim() || isLoading || isTooLong}
              className="rounded-lg border border-[#6c63ff] bg-[#6c63ff] px-4 py-2 text-white hover:bg-[#5c54e6]"
            >
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatPanel
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { Send, Zap, Sparkles } from 'lucide-react'
import ChatBubble from '../components/assistant/ChatBubble'
import useAuthStore from '../store/authStore'
import { sendAssistantMessage } from '../lib/api'
import { cn } from '../lib/utils'

const SUGGESTIONS = [
  'What should I focus on today?',
  'Show me urgent messages',
  'How many tasks do I have?',
  'Clean my inbox from noise',
  'Give me a briefing',
]

const INITIAL_MESSAGE = {
  id: 'intro',
  text: "Hey! I'm **SIGNAL**, your AI communication assistant.\n\nI can help you:\n• Prioritize your day\n• Find urgent messages\n• Manage your task list\n• Clean your inbox\n\nWhat do you need help with?",
  isUser: false,
}

export default function Assistant() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (text) => sendAssistantMessage(text, user?.uid || 'anonymous'),
    onSuccess: (data, text) => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: data.response || data, isUser: false, actions: data.actions },
      ])
    },
    onError: () => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: "Sorry, I couldn't process that. Please make sure the backend is running.", isUser: false },
      ])
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  const sendMessage = (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isPending) return

    setMessages(prev => [...prev, { id: Date.now(), text: trimmed, isUser: true }])
    setInput('')
    mutate(trimmed)
    inputRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/[0.05] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <h1 className="text-white font-bold text-base">SIGNAL Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 text-xs">Online · AI-powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isUser={msg.isUser}
            />
          ))}
          {isPending && <ChatBubble isLoading key="loading" />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex-shrink-0 px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/30 px-3 py-1.5 rounded-full transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/[0.05] px-6 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask SIGNAL anything..."
              rows={1}
              className="signal-input resize-none overflow-hidden pr-12"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isPending}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0',
              input.trim() && !isPending
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
                : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-slate-700 text-[11px] mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

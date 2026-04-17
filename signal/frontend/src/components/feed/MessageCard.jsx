import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Hash, Clock, MessageCircle, RefreshCw, Zap, Send, Sparkles } from 'lucide-react'
import { cn, formatRelativeTime, getPriorityConfig } from '../../lib/utils'
import { useMutation } from '@tanstack/react-query'
import { generateAIDrafts } from '../../lib/api'
import toast from 'react-hot-toast'

const PlatformIcon = ({ platform }) => {
  const platforms = {
    gmail: { 
      icon: Mail, 
      color: 'bg-red-500/10 border-red-500/20 text-red-400',
      label: 'Gmail'
    },
    slack: { 
      icon: Hash, 
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      label: 'Slack'
    },
    whatsapp: { 
      icon: MessageCircle, 
      color: 'bg-green-500/10 border-green-500/20 text-green-400',
      label: 'WhatsApp'
    }
  }

  const config = platforms[platform] || platforms.slack
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md border", config.color)}>
      <Icon className="w-3 h-3" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
    </div>
  )
}

export default function MessageCard({ message, index = 0, onExtractTasks }) {
  const config = getPriorityConfig(message.classification)
  const isUrgent = message.classification === 'urgent'

  const [aiDrafts, setAiDrafts] = useState([])
  const [isReplying, setIsReplying] = useState(false)
  const [editingDraft, setEditingDraft] = useState(null)

  const { mutate: generate, isPending: isGenerating } = useMutation({
    mutationFn: () => generateAIDrafts(message),
    onSuccess: (data) => setAiDrafts(data),
    onError: () => toast.error('Failed to generate professional drafts')
  })

  const drafts = aiDrafts.length > 0 ? aiDrafts : [
    `Hi ${message.senderName}, thanks for the update.`,
    `Received, I'll get back to you soon.`,
    `Got it!`
  ]

  const handleSend = async () => {
    if (!editingDraft || isReplying) return
    setIsReplying(true)
    // Simulate API call to Gmail/Slack/WhatsApp
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success(`Replied via ${message.platform.toUpperCase()}: "${editingDraft}"`)
    setIsReplying(false)
    setEditingDraft(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={cn(
        'glass-card rounded-2xl p-4 transition-all duration-200 group cursor-pointer',
        'hover:border-white/10 hover:bg-white/[0.04]',
        isUrgent && 'border-red-500/20 shadow-lg shadow-red-500/5'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Priority dot */}
        <div className="flex-shrink-0 mt-1.5">
          <div className={cn('w-2 h-2 rounded-full', config.dot, isUrgent && 'animate-pulse shadow-lg shadow-red-500/50')} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1.5">
            <PlatformIcon platform={message.platform} />
            <span className="text-white font-semibold text-sm truncate">{message.senderName}</span>
            <span
              className={cn(
                'ml-auto flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                config.bg, config.color, config.border
              )}
            >
              {config.emoji} {config.label}
            </span>
          </div>

          {/* Subject */}
          {message.subject && (
            <p className="text-slate-300 text-xs font-medium mb-1 truncate">{message.subject}</p>
          )}

          {/* AI Summary */}
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{message.summary}</p>

          {/* AI Drafts */}
          <div className="mt-4 flex flex-col gap-2">
            {!aiDrafts.length && !isGenerating && (
              <button
                onClick={(e) => { e.stopPropagation(); generate() }}
                className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors w-fit group/ai"
              >
                <Sparkles className="w-3 h-3 group-hover/ai:animate-pulse" />
                Generate Professional AI Drafts
              </button>
            )}

            {isGenerating && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                AI is writing professional responses...
              </div>
            )}

            {(aiDrafts.length > 0 || !isGenerating) && (
              <div className="flex flex-wrap gap-2">
                {drafts.map((draft, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingDraft(draft)
                    }}
                    className="text-[10px] text-left font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-3 py-2 rounded-xl transition-all max-w-full truncate"
                  >
                    {aiDrafts.length > 0 ? draft.slice(0, 60) + '...' : draft}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer Bar */}
          <AnimatePresence>
            {editingDraft !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-2 flex gap-2">
                  <input
                    autoFocus
                    value={editingDraft}
                    onChange={(e) => setEditingDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-transparent border-none text-white text-xs px-2 focus:ring-0"
                    placeholder="Refine your reply..."
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingDraft(null) }}
                    className="p-1 px-3 text-slate-500 hover:text-white text-[10px] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSend() }}
                    disabled={isReplying}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    {isReplying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 border-t border-white/[0.03] pt-3">
            <div className="flex items-center gap-1 text-slate-600 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(message.timestamp)}</span>
            </div>

            <div className="flex items-center gap-2">
              {message.tasks && message.tasks.length > 0 && (
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  {message.tasks.length} task{message.tasks.length > 1 ? 's' : ''}
                </span>
              )}
              {onExtractTasks && (
                <button
                  onClick={(e) => { e.stopPropagation(); onExtractTasks(message) }}
                  className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Extract tasks →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

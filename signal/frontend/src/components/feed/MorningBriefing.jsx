import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, Clock, AlertCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { generateBriefing } from '../../lib/api'
import useFeedStore from '../../store/feedStore'
import useAuthStore from '../../store/authStore'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

function renderBriefingText(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    // Bold **text**
    const parts = line.split(/\*\*(.+?)\*\*/g)
    return (
      <p key={i} className={cn('text-sm leading-relaxed', line.startsWith('Good') ? 'text-white font-medium' : 'text-slate-300')}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
        )}
      </p>
    )
  })
}

export default function MorningBriefing() {
  const [open, setOpen] = useState(true)
  const { briefing, setBriefing } = useFeedStore()
  const { user } = useAuthStore()

  const { mutate, isPending } = useMutation({
    mutationFn: () => generateBriefing(user?.uid || 'anonymous'),
    onSuccess: (data) => {
      setBriefing(data)
      toast.success('Briefing generated!')
    },
    onError: () => toast.error('Failed to generate briefing'),
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-indigo-500/20 overflow-hidden mb-5 glow-indigo"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Morning Briefing</p>
            <p className="text-slate-500 text-xs">AI-generated daily summary</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {briefing && (
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {new Date(briefing.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <ChevronDown className={cn('w-4 h-4 text-slate-500 transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="noise-line mb-4" />

              {briefing ? (
                <div className="space-y-1 mb-4">
                  {renderBriefingText(briefing.briefing)}
                </div>
              ) : (
                <div className="flex items-start gap-3 mb-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                  <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-400 text-sm">
                    Generate your personalized AI briefing to start the day with clarity.
                  </p>
                </div>
              )}

              <button
                onClick={() => mutate()}
                disabled={isPending}
                className="btn-primary w-full justify-center"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {briefing ? 'Regenerate Briefing' : 'Generate Briefing'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

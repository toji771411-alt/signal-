import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Check, Mail, Trash2, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import useFeedStore from '../../store/feedStore'
import toast from 'react-hot-toast'

export default function AgentSuggestions() {
  const { suggestions, dismissSuggestion, dismissAllSuggestions } = useFeedStore()

  if (suggestions.length === 0) return null

  const handleAct = (id, title) => {
    toast.success(`Agent executed: ${title}`, {
      icon: '🤖',
      style: { background: '#1e1b4b', border: '1px solid #4338ca' }
    })
    dismissSuggestion(id)
  }

  return (
    <div className="mb-10 px-2 lg:px-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
            Agent Suggestions
          </h2>
          <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] flex items-center justify-center text-indigo-400 font-bold">
            {suggestions.length}
          </span>
        </div>
        <button 
          onClick={dismissAllSuggestions}
          className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
        >
          Dismiss All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mask-linear-right">
        <AnimatePresence mode='popLayout'>
          {suggestions.map((sug) => (
            <motion.div
              key={sug.id}
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="min-w-[320px] max-w-[320px] glass-card rounded-2xl p-5 border border-white/[0.05] relative group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-tighter text-indigo-400/50">
                    Insight
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400/80 uppercase tracking-widest">
                  Confirm
                </div>
              </div>

              <h3 className="text-white font-bold text-sm mb-1 leading-snug group-hover:text-indigo-100 transition-colors">
                {sug.title}
              </h3>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 mb-6">
                {sug.subtitle}
              </p>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleAct(sug.id, sug.title)}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black transition-all hover:scale-105"
                >
                  {sug.actionLabel}
                </button>
                {sug.type === 'clean' && (
                  <button className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold px-2">
                    Preview
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

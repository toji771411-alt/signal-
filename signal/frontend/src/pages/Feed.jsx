import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { RefreshCw, Filter, Zap, TrendingUp } from 'lucide-react'
import MessageCard from '../components/feed/MessageCard'
import MorningBriefing from '../components/feed/MorningBriefing'
import ConnectedApps from '../components/feed/ConnectedApps'
import FloatingAssistant from '../components/assistant/FloatingAssistant'
import useAuthStore from '../store/authStore'
import useFeedStore from '../store/feedStore'
import AgentSuggestions from '../components/feed/AgentSuggestions'
import { analyzeAllMessages, extractTasks as extractTasksApi } from '../lib/api'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const FILTERS = [
  { key: 'all', label: 'All', color: 'text-white' },
  { key: 'urgent', label: '🔴 Urgent', color: 'text-red-400' },
  { key: 'needs_attention', label: '🟡 Needs Attention', color: 'text-amber-400' },
  { key: 'low_priority', label: '⚪ Low Priority', color: 'text-slate-500' },
]

function StatChip({ label, value, color }) {
  return (
    <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
      <span className={cn('text-2xl font-black', color)}>{value}</span>
      <span className="text-slate-500 text-xs font-medium">{label}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex gap-3">
        <div className="w-2 h-2 rounded-full bg-white/10 mt-1.5" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="h-3 w-24 shimmer rounded" />
            <div className="h-3 w-16 shimmer rounded ml-auto" />
          </div>
          <div className="h-3 w-3/4 shimmer rounded" />
          <div className="h-3 w-1/2 shimmer rounded" />
        </div>
      </div>
    </div>
  )
}

export default function Feed() {
  const { user } = useAuthStore()
  const { feed, setFeed, addTask, activeFilter, setActiveFilter, getFilteredFeed, getStats } = useFeedStore()
  const [hasLoaded, setHasLoaded] = useState(false)
  const stats = getStats()

  const { mutate: loadFeed, isPending } = useMutation({
    mutationFn: () => analyzeAllMessages(user?.uid || 'anonymous'),
    onSuccess: (data) => {
      setFeed(data)
      setHasLoaded(true)
      toast.success(`Analyzed ${data.length} messages`)
      
      // Auto-extract tasks from Urgent and Needs Attention messages
      const highPriority = data.filter(m => m.classification === 'urgent' || m.classification === 'needs_attention')
      if (highPriority.length > 0) {
        Promise.all(highPriority.map(m => doExtractTasks(m))).then((results) => {
          const totalFound = results.filter(Array.isArray).flat().length
          if (totalFound > 0) {
            toast.success(`AI detected ${totalFound} new tasks! 🧠`, { id: 'auto-extract' })
          }
        })
      }
    },
    onError: () => toast.error('Failed to load feed — check backend'),
  })

  const { mutate: doExtractTasks } = useMutation({
    mutationFn: (message) => extractTasksApi({ ...message, userId: user?.uid || 'anonymous' }),
    onSuccess: (tasks) => {
      tasks.forEach(addTask)
      toast.success(`${tasks.length} task${tasks.length > 1 ? 's' : ''} extracted!`)
    },
    onError: () => toast.error('Task extraction failed'),
  })

  useEffect(() => {
    if (!hasLoaded && feed.length === 0) {
      loadFeed()
    } else {
      setHasLoaded(true)
    }
  }, [])

  const filtered = getFilteredFeed()

  return (
    <div className="h-full flex flex-col relative">
      <FloatingAssistant />
      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-white/[0.05] px-8 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white font-bold text-xl">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => loadFeed()}
            disabled={isPending}
            className="btn-primary"
          >
            <RefreshCw className={cn('w-4 h-4', isPending && 'animate-spin')} />
            {isPending ? 'Analyzing...' : 'Refresh Feed'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatChip label="Urgent" value={stats.urgent} color="text-red-400" />
          <StatChip label="Attention" value={stats.needs_attention} color="text-amber-400" />
          <StatChip label="Low Priority" value={stats.low_priority} color="text-slate-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <ConnectedApps />
        
        {/* Morning Briefing */}
        <MorningBriefing />

        {/* Agent Suggestions */}
        <AgentSuggestions />

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-600 mr-1" />
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200',
                activeFilter === key
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              )}
            >
              {label}
              {key !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {key === 'urgent' ? stats.urgent : key === 'needs_attention' ? stats.needs_attention : stats.low_priority}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Feed list */}
        {isPending && feed.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium mb-1">
              {feed.length === 0 ? 'No messages loaded' : `No ${activeFilter} messages`}
            </p>
            <p className="text-slate-600 text-sm">
              {feed.length === 0 ? 'Click Refresh Feed to analyze messages' : 'Try a different filter'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg, i) => (
              <MessageCard
                key={msg.id}
                message={msg}
                index={i}
                onExtractTasks={doExtractTasks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

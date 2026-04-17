import { motion } from 'framer-motion'
import { CheckSquare, Clock, ArrowUpRight, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import useFeedStore from '../../store/feedStore'
import { updateTask } from '../../lib/api'
import toast from 'react-hot-toast'

const priorityColors = {
  high: { badge: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-500' },
  medium: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
  low: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
}

export default function TaskCard({ task, index = 0 }) {
  const { toggleTask } = useFeedStore()
  const p = priorityColors[task.priority] || priorityColors.medium

  const handleToggle = async () => {
    toggleTask(task.id)
    try {
      await updateTask(task.id, { done: !task.done })
    } catch (_) { /* silent — in-memory still toggled */ }
    if (!task.done) toast.success('Task completed! ✓')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'glass-card rounded-xl p-4 group transition-all duration-200 hover:border-white/10',
        task.done && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={cn(
            'w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200',
            task.done
              ? 'bg-indigo-500 border-indigo-500'
              : 'border-white/20 hover:border-indigo-500/60 hover:bg-indigo-500/10'
          )}
        >
          {task.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Task title */}
          <p className={cn('text-sm font-medium text-white mb-2', task.done && 'line-through text-slate-500')}>
            {task.task}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority badge */}
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', p.badge)}>
              {task.priority}
            </span>

            {/* Deadline */}
            {task.deadline && task.deadline !== 'No deadline' && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                {task.deadline}
              </span>
            )}

            {/* Source */}
            {task.sourceMessage && (
              <span className="flex items-center gap-1 text-[11px] text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-3 h-3" />
                {task.sourceMessage.senderName}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

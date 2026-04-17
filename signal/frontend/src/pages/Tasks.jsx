import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Plus, Calendar, Clock, Inbox } from 'lucide-react'
import TaskCard from '../components/tasks/TaskCard'
import useAuthStore from '../store/authStore'
import useFeedStore from '../store/feedStore'
import { getTasks } from '../lib/api'
import { groupTasksByDeadline } from '../lib/utils'

function TaskGroup({ title, icon: Icon, tasks, color, delay = 0 }) {
  if (tasks.length === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <h2 className="text-white font-semibold text-sm">{title}</h2>
        <span className="text-xs text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded-full ml-1">{tasks.length}</span>
      </div>
      <div className="space-y-2.5">
        {tasks.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Tasks() {
  const { user } = useAuthStore()
  const { tasks, setTasks } = useFeedStore()

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', user?.uid],
    queryFn: () => getTasks(user?.uid || 'anonymous'),
    onSuccess: setTasks,
    enabled: !!user,
  })

  useEffect(() => {
    if (data) setTasks(data)
  }, [data])

  const allTasks = tasks.length > 0 ? tasks : (data || [])
  const grouped = groupTasksByDeadline(allTasks.filter(t => !t.done))
  const done = allTasks.filter(t => t.done)
  const total = allTasks.length
  const doneCount = done.length
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/[0.05] px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              Task List
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Extracted from your messages by AI</p>
          </div>

          {/* Progress */}
          {total > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <span className="text-slate-500 text-xs">{doneCount}/{total} done</span>
                <span className="text-indigo-400 text-xs font-bold">{progress}%</span>
              </div>
              <div className="w-32 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-md shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 shimmer rounded" />
                    <div className="h-3 w-1/3 shimmer rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium mb-1">No tasks yet</p>
            <p className="text-slate-600 text-sm max-w-xs">
              Go to your feed and click "Extract tasks →" on messages to automatically extract action items.
            </p>
          </motion.div>
        ) : (
          <>
            <TaskGroup
              title="Today"
              icon={Clock}
              tasks={grouped.today}
              color="text-red-400"
              delay={0}
            />
            <TaskGroup
              title="This Week"
              icon={Calendar}
              tasks={grouped.thisWeek}
              color="text-amber-400"
              delay={0.1}
            />
            <TaskGroup
              title="Later"
              icon={CheckSquare}
              tasks={grouped.later}
              color="text-blue-400"
              delay={0.2}
            />
            {done.length > 0 && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <summary className="flex items-center gap-2 cursor-pointer text-slate-500 text-sm hover:text-slate-400 mb-2 select-none">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  Completed ({done.length})
                </summary>
                <div className="space-y-2.5 mt-3">
                  {done.map((task, i) => <TaskCard key={task.id} task={task} index={i} />)}
                </div>
              </motion.details>
            )}
          </>
        )}
      </div>
    </div>
  )
}

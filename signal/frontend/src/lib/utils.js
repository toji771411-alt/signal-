import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function getPriorityConfig(classification) {
  const configs = {
    urgent: {
      label: 'Urgent',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/25',
      dot: 'bg-red-500',
      glow: 'shadow-red-500/20',
      emoji: '🔴',
    },
    needs_attention: {
      label: 'Needs Attention',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/25',
      dot: 'bg-amber-500',
      glow: 'shadow-amber-500/20',
      emoji: '🟡',
    },
    low_priority: {
      label: 'Low Priority',
      color: 'text-slate-500',
      bg: 'bg-slate-500/10',
      border: 'border-white/[0.05]',
      dot: 'bg-slate-500',
      glow: '',
      emoji: '⚪',
    },
  }
  return configs[classification] || configs.low_priority
}

export function groupTasksByDeadline(tasks) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const todayKeywords = ['today', 'eod', 'end of day', 'tonight', '5 pm', '3 pm']
  const weekKeywords = ['tomorrow', 'this week', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return tasks.reduce(
    (acc, task) => {
      const dl = (task.deadline || '').toLowerCase()
      if (todayKeywords.some(k => dl.includes(k)) || task.priority === 'high') {
        acc.today.push(task)
      } else if (weekKeywords.some(k => dl.includes(k))) {
        acc.thisWeek.push(task)
      } else {
        acc.later.push(task)
      }
      return acc
    },
    { today: [], thisWeek: [], later: [] }
  )
}

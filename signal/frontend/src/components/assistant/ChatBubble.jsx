import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function ChatBubble({ message, isUser, isLoading = false }) {
  function renderText(text) {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />
      const parts = line.split(/\*\*(.+?)\*\*/g)
      return (
        <p key={i} className="leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className={isUser ? 'text-white' : 'text-indigo-300'}>{part}</strong> : part
          )}
        </p>
      )
    })
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end gap-2"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex-shrink-0 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex-shrink-0 flex items-center justify-center mb-0.5">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-2xl text-sm space-y-1',
        isUser
          ? 'bg-indigo-600 text-white rounded-br-sm'
          : 'bg-white/[0.05] border border-white/[0.08] text-slate-300 rounded-bl-sm'
      )}>
        {renderText(message.text || message.response || message)}

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/10">
            {message.actions.map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full transition-colors"
              >
                {action.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

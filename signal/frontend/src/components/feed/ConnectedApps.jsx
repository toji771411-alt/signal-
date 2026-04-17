import { motion } from 'framer-motion'
import { Mail, Slack, MessageCircle, MoreHorizontal, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

const APPS = [
  { id: 'gmail', name: 'Gmail', icon: Mail, color: 'bg-red-500', textColor: 'text-red-400', status: 'connected' },
  { id: 'slack', name: 'Slack', icon: Slack, color: 'bg-purple-500', textColor: 'text-purple-400', status: 'connected' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', textColor: 'text-green-400', status: 'connected' },
]

export default function ConnectedApps() {
  return (
    <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
      {APPS.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2.5 glass-card rounded-2xl px-3.5 py-2 group cursor-pointer hover:border-white/20 transition-all duration-300"
        >
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
            app.color,
            "bg-opacity-20 border border-white/10"
          )}>
            <app.icon className={cn("w-4 h-4", app.textColor)} />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-[11px] font-bold tracking-tight">{app.name}</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Live</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Add New App */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center w-10 h-10 rounded-2xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
      >
        <Plus className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
      </motion.button>
    </div>
  )
}

import { motion } from 'framer-motion'
import { TrendingUp, Mail, Slack, MessageCircle, ShieldCheck } from 'lucide-react'
import useNetworkStore from '../../store/networkStore'
import { cn } from '../../lib/utils'

export default function RelationshipRadar() {
  const { relationships } = useNetworkStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Social Graph Intelligence
          </h2>
          <p className="text-slate-500 text-xs mt-1">AI-calculated trust weights based on 14-day interaction patterns</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-xl border-indigo-500/20 bg-indigo-500/5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Active Learning</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relationships.sort((a,b) => b.score - a.score).map((rel, i) => (
          <motion.div
            key={rel.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4 group hover:bg-white/[0.05] transition-all duration-300 border-white/[0.05]"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black tracking-tighter border border-white/10 shadow-xl",
                  rel.score > 80 ? 'bg-indigo-500' : rel.score > 50 ? 'bg-slate-700' : 'bg-red-500/20'
                )}>
                  {rel.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{rel.score}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-white font-bold text-sm truncate">{rel.name}</h3>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest", rel.color)}>{rel.type}</span>
                </div>
                <p className="text-slate-500 text-[11px] truncate">{rel.role}</p>
                
                <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${rel.score}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    className={cn(
                      "h-full rounded-full",
                      rel.score > 80 ? 'bg-indigo-500' : rel.score > 50 ? 'bg-indigo-400/50' : 'bg-red-500/40'
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/[0.03]">
              <div className="flex gap-2">
                {rel.platforms.map(p => (
                  <div key={p} className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    {p === 'gmail' && <Mail className="w-3 h-3 text-red-400" />}
                    {p === 'slack' && <Slack className="w-3 h-3 text-indigo-400" />}
                    {p === 'whatsapp' && <MessageCircle className="w-3 h-3 text-green-400" />}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-slate-600 font-medium">Last active: {rel.lastActive}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

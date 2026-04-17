import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, LayoutDashboard, CheckSquare, MessageSquare,
  LogOut, User, Bell, ChevronRight, Share2, Settings as SettingsIcon
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useFeedStore from '../../store/feedStore'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/feed', icon: LayoutDashboard, label: 'Feed', key: 'feed' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks', key: 'tasks' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings', key: 'settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { getStats } = useFeedStore()
  const navigate = useNavigate()
  const stats = getStats()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen border-r border-white/[0.05] bg-[#070b14]">
      {/* Logo */}
      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">SIGNAL</span>
            <span className="block text-[10px] text-slate-500 font-medium tracking-widest uppercase">Comm OS</span>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="noise-line mx-5 mb-5" />

      {/* Stats */}
      {stats.urgent > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-3 mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-semibold">
            {stats.urgent} urgent message{stats.urgent > 1 ? 's' : ''}
          </span>
          <ChevronRight className="w-3 h-3 text-red-500/50 ml-auto" />
        </motion.div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn('nav-item', isActive && 'active')
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Stats summary */}
      <div className="mx-3 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Signal Overview</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Urgent', value: stats.urgent, color: 'text-red-400' },
            { label: 'Attention', value: stats.needs_attention, color: 'text-amber-400' },
            { label: 'Tasks', value: stats.totalTasks, color: 'text-indigo-400' },
            { label: 'Done', value: stats.doneTasks, color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.03] rounded-lg px-2 py-1.5">
              <span className={cn('text-sm font-bold', color)}>{value}</span>
              <span className="block text-[10px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Google Connect CTA (Visible only for mock users) */}
      {!user?.email.includes('@') || user?.isDemo ? (
        <div className="mx-3 mt-auto mb-4 p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/20">
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2 text-center">Unlock Full OS</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black transition-all shadow-xl shadow-indigo-500/10"
          >
            <div className="w-3.5 h-3.5">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            Link Google Account
          </button>
        </div>
      ) : (
        <div className="mt-auto" />
      )}

      {/* User */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              (user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.displayName || 'User'}</p>
            <p className="text-slate-500 text-[10px] truncate">{user?.email || 'demo@signal.app'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  )
}

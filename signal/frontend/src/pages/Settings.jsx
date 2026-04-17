import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, Shield, Bell, Cpu, Github, Mail, MessageSquare, MessageCircle, ExternalLink, Trash2, RefreshCcw, Lock, Zap } from 'lucide-react'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const AccountCard = ({ icon: Icon, name, description, isConnected = true, color, onReconnect, onDisconnect }) => {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    await onReconnect(name)
    setIsSyncing(false)
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/[0.05] hover:border-white/[0.1] transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.05]", color, isSyncing && "animate-pulse")}>
            {isSyncing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", isSyncing ? "bg-indigo-500 animate-ping" : isConnected ? "bg-emerald-500" : "bg-slate-500")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {isSyncing ? 'Handshaking...' : isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-slate-500 text-xs leading-relaxed mb-6 h-12 line-clamp-3">
        {description}
      </p>

      <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCcw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
          {isSyncing ? 'Syncing...' : 'Reconnect'}
        </button>
        <button 
          onClick={onDisconnect}
          className="text-[10px] font-black uppercase tracking-widest text-rose-500/70 hover:text-rose-500 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3 h-3" />
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const [accounts, setAccounts] = useState([
    {
      id: 'google',
      name: 'Google',
      icon: Mail,
      color: 'text-blue-400',
      description: 'Connect Gmail and Google Calendar to scan for unreplied emails and upcoming meetings.',
      isConnected: true,
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'text-white',
      description: 'Connect GitHub to surface unreviewed pull requests, stale issues, and missed mentions.',
      isConnected: true,
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: MessageSquare,
      color: 'text-emerald-400',
      description: 'Connect Slack to surface unanswered DMs, missed mentions, and threads you forgot to reply to.',
      isConnected: true,
    }
  ])

  const [permissions, setPermissions] = useState({
    Gmail: { Read: true, Write: true, Delete: false },
    Calendar: { Read: true, Write: true, Delete: false },
    GitHub: { Read: true, Write: false, Delete: false },
    Slack: { Read: true, Write: true, Delete: false },
  })

  const [autonomy, setAutonomy] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const AVAILABLE_SERVICES = [
    {
      id: 'google',
      name: 'Gmail',
      icon: Mail,
      color: 'text-blue-400',
      description: 'Connect Gmail and Google Calendar to scan for unreplied emails and upcoming meetings.',
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: MessageSquare,
      color: 'text-emerald-400',
      description: 'Connect Slack to surface unanswered DMs, missed mentions, and threads you forgot to reply to.',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-500',
      description: 'Sync personal chats and business groups to ensure no personal urgent tasks are missed.',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: ExternalLink,
      color: 'text-blue-500',
      description: 'Connect LinkedIn to surface recruiter DMs and professional networking opportunities.',
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: Cpu,
      color: 'text-white',
      description: 'Connect Notion to sync your tasks, project databases, and shared documentation.',
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageSquare,
      color: 'text-indigo-400',
      description: 'Connect Discord to track mentions across your favorite development communities.',
    }
  ]

  const handleReconnect = async (name) => {
    const id = toast.loading(`Connecting to ${name}...`, {
      style: { background: '#1e1b4b', border: '1px solid #4338ca' }
    })
    await new Promise(r => setTimeout(r, 1500))
    toast.success(`${name} Account Synced!`, { id })
  }

  const handleDisconnect = (id, name) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
    toast.error(`${name} Disconnected`, {
      icon: '🚫',
      style: { background: '#1e1b4b', border: '1px solid #e11d48' }
    })
  }

  const handleSelectService = (service) => {
    setShowAddModal(false)
    const id = toast.loading(`Initiating ${service.name} OAuth...`, {
      style: { background: '#1e1b4b', border: '1px solid #4338ca' }
    })
    
    setTimeout(() => {
      toast.success(`${service.name} Connected!`, { id })
      setAccounts(prev => [...prev, { ...service, isConnected: true }])
    }, 1200)
  }

  const togglePermission = (serviceId, type) => {
    setPermissions(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [type]: !prev[serviceId][type]
      }
    }))
    toast.success(`${type} permission for ${serviceId} updated`, {
      icon: '🔐',
      duration: 1500
    })
  }

  return (
    <div className="h-full overflow-y-auto px-10 py-10 relative">
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#070b14]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 relative z-10"
            >
              <h2 className="text-xl font-black text-white mb-2">Add Connection</h2>
              <p className="text-slate-500 text-xs mb-8">Select a service to expand your Signal intelligence</p>
              
              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {AVAILABLE_SERVICES.filter(s => !accounts.find(a => a.id === s.id)).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group text-left"
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", service.color)}>
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{service.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{service.description.slice(0, 40)}...</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-full mt-6 py-3 text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <SettingsIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
            <p className="text-slate-500 text-sm">Manage your account, connections, and AI preferences</p>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Connected Accounts</h2>
              <p className="text-xs text-slate-500">Link your services to start finding loose ends</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <AccountCard 
                key={acc.id} 
                {...acc} 
                onReconnect={() => handleReconnect(acc.name)}
                onDisconnect={() => handleDisconnect(acc.id, acc.name)}
              />
            ))}
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="glass-card rounded-2xl p-5 border border-dashed border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group flex flex-col items-center justify-center text-center gap-3 min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl text-slate-600">+</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Add Connection</p>
                <p className="text-[10px] text-slate-500 mt-1">Pick a new service</p>
              </div>
            </button>
          </div>
        </section>

        {/* Agent Permissions Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agent Permissions</h2>
              <p className="text-xs text-slate-500">Control what the AI agent can do with each service</p>
            </div>
          </div>
          
          <div className="glass-card rounded-3xl border border-white/[0.05] overflow-hidden">
            <div className="grid grid-cols-[1fr_repeat(3,100px)] p-6 items-center border-b border-white/[0.05] bg-white/[0.02]">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">Service</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-center">Read</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-center">Write</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-center">Delete</div>
            </div>

            {[
              { id: 'Gmail', name: 'Gmail', icon: Mail, perms: ['Read', 'Write', 'Delete'], color: 'text-blue-400' },
              { id: 'Calendar', name: 'Calendar', icon: Bell, perms: ['Read', 'Write', 'Delete'], color: 'text-indigo-400' },
              { id: 'GitHub', name: 'GitHub', icon: Github, perms: ['Read', 'Write', 'Delete'], color: 'text-white' },
              { id: 'Slack', name: 'Slack', icon: MessageSquare, perms: ['Read', 'Write', null], color: 'text-emerald-400' },
            ].map((service) => (
              <div key={service.id} className="grid grid-cols-[1fr_repeat(3,100px)] p-6 items-center border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  <service.icon className={cn("w-4 h-4", service.color)} />
                  <span className="text-sm font-bold text-white/90">{service.name}</span>
                </div>
                {service.perms.map((pType, i) => (
                  <div key={i} className="flex justify-center">
                    {pType ? (
                      <div 
                        onClick={() => togglePermission(service.id, pType)}
                        className="flex flex-col items-center gap-1.5 group/toggle cursor-pointer"
                      >
                        <div className={cn(
                          "w-8 h-4 rounded-full flex items-center px-1 transition-all duration-300",
                          permissions[service.id]?.[pType] ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "bg-white/10"
                        )}>
                          <motion.div 
                            layout
                            className={cn("w-2.5 h-2.5 rounded-full", permissions[service.id]?.[pType] ? "bg-white ml-auto" : "bg-slate-500")} 
                          />
                        </div>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-tighter transition-colors text-center",
                          permissions[service.id]?.[pType] ? "text-orange-400" : "text-slate-600"
                        )}>
                          {pType === 'Write' ? (service.id === 'GitHub' ? 'Comment' : service.id === 'Calendar' ? 'Create' : 'Reply') : pType}
                        </span>
                      </div>
                    ) : (
                      <div className="w-8 h-4 bg-white/5 rounded-full opacity-20" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Agent Autonomy Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-orange-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Agent Autonomy</h2>
              <p className="text-xs text-slate-500">Let the agent act on its own — no per-action approval needed</p>
            </div>
          </div>
          
          <div 
            onClick={() => {
              setAutonomy(!autonomy)
              toast.success(`Agent Autonomy ${!autonomy ? 'Enabled' : 'Disabled'}`, { icon: !autonomy ? '🤖' : '🔒' })
            }}
            className="glass-card rounded-2xl p-6 border border-white/[0.05] bg-gradient-to-r from-orange-500/5 to-transparent cursor-pointer group/auto hover:border-orange-500/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                  autonomy ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30" : "bg-orange-500/10 text-orange-500"
                )}>
                  <Zap className={cn("w-5 h-5", autonomy && "fill-current")} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Auto-act on suggestions</h3>
                  <p className="text-xs text-slate-500">Let the agent execute low-risk suggestions automatically</p>
                </div>
              </div>
              <div className={cn(
                "w-10 h-5 rounded-full flex items-center px-1 transition-all duration-300",
                autonomy ? "bg-orange-600" : "bg-white/5"
              )}>
                <motion.div 
                  layout
                  className={cn("w-3.5 h-3.5 rounded-full shadow-sm", autonomy ? "bg-white ml-auto" : "bg-slate-600")} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3 text-slate-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              Powered by Auth0 FGA <span className="text-emerald-500 px-1.5 py-0.5 bg-emerald-500/10 rounded ml-1">Live</span>
            </span>
          </div>
        </section>

        {/* AI Preferences */}
        <section className="glass-card rounded-3xl p-8 border border-white/[0.05] relative overflow-hidden group mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">AI Engine Configuration</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Provider</p>
                <p className="text-xs text-slate-500 mt-0.5">Currently using Groq (Llama 3)</p>
              </div>
              <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-indigo-500/20">
                Active
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Auto-Drafting</p>
                <p className="text-xs text-slate-500 mt-0.5">Automatically prepare professional replies for urgent items</p>
              </div>
              <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center px-1">
                <div className="w-3.5 h-3.5 bg-white rounded-full ml-auto shadow-sm" />
              </div>
            </div>
          </div>
        </section>

      </motion.div>
    </div>
  )
}

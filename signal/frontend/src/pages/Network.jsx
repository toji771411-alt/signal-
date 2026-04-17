import { motion } from 'framer-motion'
import { Share2, Users, Search } from 'lucide-react'
import RelationshipRadar from '../components/network/RelationshipRadar'

export default function Network() {
  return (
    <div className="h-full flex flex-col px-8 py-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Share2 className="w-8 h-8 text-indigo-500" />
            Social Graph
          </h1>
          <p className="text-slate-500 mt-1">Intelligent mapping of your professional and personal network.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search connections..." 
            className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RelationshipRadar />
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border-indigo-500/20 bg-indigo-500/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Network Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Total Connections</span>
                <span className="text-white font-bold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">High Trust (80+)</span>
                <span className="text-indigo-400 font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Multi-channel</span>
                <span className="text-white font-bold">42</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20">
              Analyze New Connections
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 border-white/5">
            <h3 className="text-white font-bold mb-4 text-sm tracking-tight">Recent Intelligence</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Vikram Nair</span> switched from Slack to Gmail for your last interaction. Professional priority increasing.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Rahul Sharma</span> usually replies in <span className="text-green-400">12 mins</span>. Relationship health is stable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

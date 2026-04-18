import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Chrome, ArrowRight, Shield, Brain, Layers } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const features = [
  { icon: Brain, label: 'AI Triage', desc: 'Every message classified instantly' },
  { icon: Layers, label: 'Unified Feed', desc: 'Gmail + Slack in one place' },
  { icon: Shield, label: 'Only What Matters', desc: 'Signal over noise, always' },
]

export default function Login() {
  const { user, loginWithGoogle, loginAsDemo, loading } = useAuthStore()
  const [signingIn, setSigningIn] = useState(false)

  if (user) return <Navigate to="/feed" replace />

  const handleGoogleLogin = async () => {
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (e) {
      toast.error('Google login failed. Try Demo Mode instead.')
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight italic">unibox</span>
              <span className="block text-[11px] text-slate-500 font-medium tracking-widest uppercase">Communication OS</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-5xl font-black text-white leading-none mb-4">
              Cut through
              <br />
              <span className="gradient-text">the noise.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              unibox filters every message, classifies what matters, and extracts your action items — automatically.
            </p>
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-indigo-400" size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-600 text-xs"
        >
          Built for people who do real work.
        </motion.div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-6"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-xl italic">unibox</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to your communication OS</p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={signingIn || loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-xl shadow-black/20 disabled:opacity-70"
          >
            {signingIn ? (
              <svg className="w-5 h-5 animate-spin text-slate-600" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo login */}
          <button
            onClick={loginAsDemo}
            className="w-full btn-ghost justify-center"
          >
            <ArrowRight className="w-4 h-4" />
            Try Demo Mode
          </button>

          <p className="text-slate-600 text-xs text-center leading-relaxed">
            Demo mode uses mock data and simulated AI.{' '}
            <br />No account required.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

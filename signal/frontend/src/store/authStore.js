import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth, googleProvider } from '../lib/firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const DEMO_USER = {
  uid: 'demo-user-001',
  displayName: 'Demo User',
  email: 'demo@signal.app',
  photoURL: null,
  isDemoMode: true,
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,
      isDemoMode: false,

      init: () => {
        if (!auth) {
          set({ loading: false, isDemoMode: true })
          return
        }
        const unsub = onAuthStateChanged(auth, (user) => {
          set({ user, loading: false })
        })
        return unsub
      },

      loginWithGoogle: async () => {
        set({ error: null })
        try {
          if (!auth || !googleProvider) throw new Error('Firebase not configured')
          const result = await signInWithPopup(auth, googleProvider)
          set({ user: result.user, error: null })
        } catch (e) {
          console.warn('Google login failed:', e.message)
          let errorMsg = e.message
          if (e.message.includes('api-key-not-valid')) {
            errorMsg = "Firebase keys are missing or invalid in your .env file. Please check them or use Try Demo Mode."
          }
          set({ error: errorMsg })
          throw new Error(errorMsg)
        }
      },

      loginAsDemo: () => {
        set({ user: DEMO_USER, isDemoMode: true, loading: false, error: null })
      },

      logout: async () => {
        try {
          if (auth && !get().isDemoMode) await signOut(auth)
        } catch (_) {}
        set({ user: null, isDemoMode: false })
      },
    }),
    {
      name: 'signal-auth',
      partialState: (state) => ({ user: state.user, isDemoMode: state.isDemoMode }),
    }
  )
)

export default useAuthStore

import { create } from 'zustand'

const MOCK_RELATIONSHIPS = [
  { id: 'rel-1', name: 'Vikram Nair', role: 'CEO', score: 98, platforms: ['gmail', 'slack'], avatar: 'VN', type: 'professional', lastActive: '2 mins ago', color: 'text-rose-400' },
  { id: 'rel-2', name: 'Rahul Sharma', role: 'Engineering Manager', score: 85, platforms: ['slack'], avatar: 'RS', type: 'professional', lastActive: '30 mins ago', color: 'text-amber-400' },
  { id: 'rel-3', name: 'Amit', role: 'Brother', score: 92, platforms: ['whatsapp'], avatar: 'A', type: 'personal', lastActive: '5 mins ago', color: 'text-green-400' },
  { id: 'rel-4', name: 'Priya Mehta', role: 'Product Lead', score: 72, platforms: ['gmail', 'slack'], avatar: 'PM', type: 'professional', lastActive: '1 hr ago', color: 'text-indigo-400' },
  { id: 'rel-5', name: 'GitHub Bot', role: 'Automation', score: 15, platforms: ['slack'], avatar: 'GH', type: 'system', lastActive: '20 mins ago', color: 'text-slate-400' },
]

const useNetworkStore = create((set, get) => ({
  relationships: MOCK_RELATIONSHIPS,
  
  getRelationship: (name) => {
    const rel = get().relationships.find(r => r.name.includes(name) || name.includes(r.name))
    return rel || { score: 50 } // default score
  },

  updateScore: (id, delta) => set(s => ({
    relationships: s.relationships.map(r => 
      r.id === id ? { ...r, score: Math.min(100, Math.max(0, r.score + delta)) } : r
    )
  }))
}))

export default useNetworkStore

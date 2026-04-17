import { create } from 'zustand'
import useNetworkStore from './networkStore'

const useFeedStore = create((set, get) => ({
  feed: [],
  tasks: [],
  briefing: null,
  activeFilter: 'all',
  isLoading: false,
  suggestions: [
    {
      id: 's1',
      title: 'Phone escalate Mahesh Kumar',
      subtitle: 'Second consecutive DNS delivery failure to...',
      type: 'critical',
      actionLabel: 'Act'
    },
    {
      id: 's2',
      title: 'Defer Itious meetup',
      subtitle: 'Itious requests an important hackathon meeti...',
      type: 'delay',
      actionLabel: 'Act'
    },
    {
      id: 's3',
      title: 'Clean up 37 junk emails',
      subtitle: 'Bryan Clark, Kira on TikTok +35 more',
      type: 'clean',
      actionLabel: 'Clean Up'
    }
  ],

  setFeed: (feed) => set({ feed }),
  setTasks: (tasks) => set({ tasks }),
  setBriefing: (briefing) => set({ briefing }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setLoading: (isLoading) => set({ isLoading }),
  
  dismissSuggestion: (id) => set((s) => ({
    suggestions: s.suggestions.filter(sug => sug.id !== id)
  })),
  dismissAllSuggestions: () => set({ suggestions: [] }),

  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  
  updateMessageClassification: (id, classification) =>
    set((s) => ({
      feed: s.feed.map((m) => (m.id === id ? { ...m, classification } : m)),
    })),

  getFilteredFeed: () => {
    const { feed, activeFilter } = get()
    const { getRelationship } = useNetworkStore.getState()
    
    let filtered = activeFilter === 'all' 
      ? feed 
      : feed.filter((m) => m.classification === activeFilter)

    // Sort by Relationship Score then by Time
    return [...filtered].sort((a, b) => {
      const scoreA = getRelationship(a.senderName).score
      const scoreB = getRelationship(b.senderName).score
      
      if (scoreA !== scoreB) return scoreB - scoreA
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  },

  getStats: () => {
    const { feed, tasks } = get()
    return {
      urgent: feed.filter((m) => m.classification === 'urgent').length,
      needs_attention: feed.filter((m) => m.classification === 'needs_attention').length,
      low_priority: feed.filter((m) => m.classification === 'low_priority').length,
      totalTasks: tasks.length,
      doneTasks: tasks.filter((t) => t.done).length,
    }
  },
}))

export default useFeedStore

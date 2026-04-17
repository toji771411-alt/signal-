import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Messages ────────────────────────────────────────────────────────────────
export const analyzeAllMessages = (userId) =>
  api.post('/messages/analyze-all', { userId }).then(r => r.data)

export const analyzeMessage = (message) =>
  api.post('/messages/analyze', message).then(r => r.data)

export const getFeed = (userId) =>
  api.get('/messages/feed', { params: { userId } }).then(r => r.data)

export const getMockMessages = () =>
  api.get('/messages/mock').then(r => r.data)

export const generateAIDrafts = (message) =>
  api.post('/messages/drafts', message).then(r => r.data)

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const getTasks = (userId) =>
  api.get('/tasks', { params: { userId } }).then(r => r.data)

export const createTask = (task) =>
  api.post('/tasks', task).then(r => r.data)

export const extractTasks = (message) =>
  api.post('/tasks/extract', message).then(r => r.data)

export const updateTask = (id, updates) =>
  api.patch(`/tasks/${id}`, updates).then(r => r.data)

// ─── Briefing ─────────────────────────────────────────────────────────────────
export const generateBriefing = (userId) =>
  api.post('/briefing', { userId }).then(r => r.data)

// ─── Assistant ────────────────────────────────────────────────────────────────
export const sendAssistantMessage = (message, userId) =>
  api.post('/assistant', { message, userId }).then(r => r.data)

export default api

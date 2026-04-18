import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { Send, Zap, X, Minus } from 'lucide-react'
import ChatBubble from './ChatBubble'
import useAuthStore from '../../store/authStore'
import { sendAssistantMessage } from '../../lib/api'
import { cn } from '../../lib/utils'
import useFeedStore from '../../store/feedStore'
import toast from 'react-hot-toast'

const INITIAL_MESSAGE = {
  id: 'intro',
  text: "How can I help you with your feed today? I have full rights to manage your tasks and messages.",
  isUser: false,
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthStore()
  const { toggleTask, updateMessageClassification, tasks, feed } = useFeedStore()
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  const executeAction = (action) => {
    switch(action.type) {
      case 'COMPLETE_TASK':
        toggleTask(action.taskId)
        toast.success(`Task marked as complete!`, { icon: '✅' })
        break
      case 'LOW_PRIORITY':
        updateMessageClassification(action.messageId, 'low_priority')
        toast.success(`Moved message to Low Priority`, { icon: '💤' })
        break
      case 'MARK_ATTENTION':
        updateMessageClassification(action.messageId, 'needs_attention')
        toast.success(`Moved to Needs Attention`, { icon: '🟡' })
        break
      default:
        console.warn('Unknown action:', action)
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (text) => sendAssistantMessage(text, user?.uid || 'anonymous'),
    onSuccess: (data) => {
      const respText = typeof data === 'string' ? data : data.response
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: respText, isUser: false },
      ])
      
      // Execute AI-triggered actions
      if (data.actions && Array.isArray(data.actions)) {
        data.actions.forEach(executeAction)
      }
    },
  })

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isPending])

  const sendMessage = () => {
    if (!input.trim() || isPending) return
    const text = input.trim()
    setMessages(prev => [...prev, { id: Date.now(), text, isUser: true }])
    setInput('')
    mutate(text)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 h-[450px] bg-[#0c121e] border border-white/10 rounded-3xl shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-indigo-600/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold text-xs uppercase tracking-widest italic">unibox AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} isUser={msg.isUser} />
              ))}
              {isPending && <ChatBubble isLoading />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask ai..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              />
              <button 
                onClick={sendMessage}
                className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300",
          isOpen ? "bg-red-500 shadow-red-500/20" : "bg-indigo-600 shadow-indigo-500/30"
        )}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
      </motion.button>
    </div>
  )
}

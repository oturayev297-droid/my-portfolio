import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiChat } from '../api'
import { useLang } from '../lang'

export default function AIWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Assalomu alaykum! Men Ozodbekning virtual yordamchisiman. Sizga qanday loyiha kerak? (Landing, E-commerce, Mobile App...)" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const history = messages.map((m) => ({
        role: m.role === 'bot' ? 'model' : 'user',
        content: m.text,
      }))
      const data = await aiChat(userMsg, history)
      setMessages((prev) => [...prev, { role: 'bot', text: data.response }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: "Uzr, texnik xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." }])
    }
    setLoading(false)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ai-header">
              <i className="fas fa-robot" />
              <span>Ozodbek AI Assistant</span>
              <div className="ai-status" />
              <button className="ai-close" onClick={() => setOpen(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="ai-messages" ref={chatRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>{msg.text}</div>
              ))}
              {loading && <div className="chat-msg bot loading">...</div>}
            </div>
            <form className="ai-input-wrap" onSubmit={handleSubmit}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('ai.placeholder')} disabled={loading} />
              <button type="submit" disabled={loading}><i className="fas fa-paper-plane" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="ai-trigger"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? <i className="fas fa-times" /> : <i className="fas fa-bolt" />}
      </motion.button>
    </>
  )
}

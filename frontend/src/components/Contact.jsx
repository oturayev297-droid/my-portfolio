import { useState } from 'react'
import { motion } from 'framer-motion'
import { submitContact } from '../api'
import { useLang } from '../lang'

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', telegram: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useLang()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      const res = await submitContact(data)
      if (res.status === 'success') {
        setStatus({ type: 'success', text: t('contact.success') })
        setForm({ full_name: '', telegram: '', subject: '', message: '' })
      } else {
        setStatus({ type: 'error', text: t('contact.error') })
      }
    } catch {
      setStatus({ type: 'error', text: t('contact.error') })
    }
    setLoading(false)
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-grid">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">{t('contact.title')} <span className="gradient-text">{t('contact.titleGrad')}</span></h2>
          <p className="contact-intro">{t('contact.intro')}</p>
          <div className="contact-methods">
            <a href="https://t.me/Turayevvv_Web" target="_blank" rel="noopener noreferrer" className="contact-method glass-card">
              <div className="method-icon"><i className="fab fa-telegram" /></div>
              <div className="method-text">
                <span>{t('contact.telegram')}</span>
                <p>@Turayevvv_Web</p>
              </div>
              <i className="fas fa-chevron-right method-arrow" />
            </a>
            <div className="contact-method glass-card">
              <div className="method-icon"><i className="fas fa-location-dot" /></div>
              <div className="method-text">
                <span>{t('contact.location')}</span>
                <p>{t('contact.locationV')}</p>
              </div>
            </div>
          </div>
          <div className="avail-badge">
            <span className="avail-dot" />
            {t('contact.avail')}
          </div>
        </motion.div>

        <motion.div
          className="contact-form-wrap"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="form-card glass-card">
            <div className="form-header">
              <h3>{t('contact.formTitle')}</h3>
              <p>{t('contact.formSub')}</p>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="input-group">
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required placeholder=" " />
                  <label>{t('contact.nameLabel')}</label>
                  <div className="input-line" />
                </div>
                <div className="input-group">
                  <input type="text" name="telegram" value={form.telegram} onChange={handleChange} required placeholder=" " />
                  <label>{t('contact.tgLabel')}</label>
                  <div className="input-line" />
                </div>
              </div>
              <div className="input-group">
                <input type="text" name="subject" value={form.subject} onChange={handleChange} required placeholder=" " />
                <label>{t('contact.subjLabel')}</label>
                <div className="input-line" />
              </div>
              <div className="input-group">
                <textarea name="message" value={form.message} onChange={handleChange} required rows="5" placeholder=" " />
                <label>{t('contact.msgLabel')}</label>
                <div className="input-line" />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin" /> {t('contact.sending')}</>
                ) : (
                  <><span>{t('contact.btn')}</span> <i className="fas fa-paper-plane" /></>
                )}
              </button>
              {status && (
                <div className={`form-response ${status.type}`}>
                  <i className={`fas fa-${status.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />
                  {status.text}
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

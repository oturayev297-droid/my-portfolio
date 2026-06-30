import { motion } from 'framer-motion'
import { useLang } from '../lang'

const aiIcons = {
  'ChatGPT / OpenAI': 'fas fa-brain',
  'Google Gemini': 'fas fa-sparkles',
  'Claude (Anthropic)': 'fas fa-robot',
  'GitHub Copilot': 'fas fa-code',
  'Midjourney / DALL-E': 'fas fa-palette',
  'Hugging Face': 'fas fa-smile',
  'TensorFlow / PyTorch': 'fas fa-cogs',
  'Stable Diffusion': 'fas fa-magic',
}

export default function About() {
  const { t } = useLang()

  const aiTools = [
    t('about.ai1'), t('about.ai2'), t('about.ai3'), t('about.ai4'),
    t('about.ai5'), t('about.ai6'), t('about.ai7'), t('about.ai8'),
  ]

  return (
    <section id="about" className="about">
      <div className="about-grid">
        <motion.div
          className="about-image-wrap"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="about-image glass-card">
            <img src="/images/photo_2026-05-12_11-39-43.jpg" alt="Ozodbek Turayev" />
          </div>
          <motion.div
            className="floating-stat glass-card"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <h3>5+</h3>
            <p>{t('about.stat0')}</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="about-text"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            {t('about.title')} <span className="gradient-text">{t('about.titleGrad')}</span> {t('about.titleEnd')}
          </h2>
          <p className="about-desc">{t('about.desc')}</p>
          <div className="stats-row">
            {[
              { target: '50+', label: t('about.stat1') },
              { target: '500+', label: t('about.stat2') },
              { target: '100%', label: t('about.stat3') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-box glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <span className="stat-num">{stat.target}</span>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Expertise Section */}
      <motion.div
        className="ai-expertise"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <h2 className="section-title">
            {t('about.aiTitle')} <span className="gradient-text">{t('about.aiTitleGrad')}</span>
          </h2>
          <p className="ai-desc">{t('about.aiDesc')}</p>
        </div>

        <div className="ai-tools-grid">
          {aiTools.map((name, i) => (
            <motion.div
              key={i}
              className="ai-tool-chip glass-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <i className={aiIcons[name] || 'fas fa-microchip'} />
              <span>{name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

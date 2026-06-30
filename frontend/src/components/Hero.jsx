import { motion } from 'framer-motion'
import { useLang } from '../lang'

const floatingIcons = [
  { icon: 'fab fa-python', style: { top: '15%', left: '10%' }, color: '#3776AB' },
  { icon: 'fab fa-js', style: { top: '25%', right: '15%' }, color: '#F7DF1E' },
  { icon: 'fas fa-database', style: { bottom: '30%', left: '8%' }, color: '#00d4ff' },
  { icon: 'fab fa-react', style: { bottom: '20%', right: '10%' }, color: '#61DAFB' },
  { icon: 'fab fa-node-js', style: { top: '10%', right: '30%' }, color: '#339933' },
  { icon: 'fas fa-bolt', style: { bottom: '35%', left: '25%' }, color: '#ff6b9d' },
]

export default function Hero() {
  const { t } = useLang()

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <b>{t('hero.subtitle')}</b>
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {t('hero.title1')}<br />
          <span className="gradient-text">{t('hero.title2')}</span><br />
          {t('hero.title3')}
        </motion.h1>

        <motion.p
          className="hero-desc"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t('hero.desc')}
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <a href="#projects" className="btn btn-primary">
            <span>{t('hero.cta')}</span>
            <i className="fas fa-arrow-right" />
          </a>
          <a href="#contact" className="btn btn-outline">
            <span>{t('hero.cta2')}</span>
          </a>
        </motion.div>
      </div>

      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="float-icon glass-card"
          style={item.style}
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          <i className={item.icon} style={{ color: item.color }} />
        </motion.div>
      ))}
    </section>
  )
}

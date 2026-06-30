import { motion } from 'framer-motion'
import { useLang } from '../lang'

export default function Services() {
  const { t } = useLang()
  const services = [
    { icon: 'fas fa-globe', title: t('services.s1'), desc: t('services.s1d') },
    { icon: 'fas fa-mobile-alt', title: t('services.s2'), desc: t('services.s2d') },
    { icon: 'fas fa-bezier-curve', title: t('services.s3'), desc: t('services.s3d') },
    { icon: 'fas fa-chalkboard-teacher', title: t('services.s4'), desc: t('services.s4d') },
    { icon: 'fas fa-robot', title: t('services.s5'), desc: t('services.s5d') },
    { icon: 'fab fa-telegram-plane', title: t('services.s6'), desc: t('services.s6d') },
  ]

  return (
    <section id="services" className="services">
      <div className="text-center">
        <h2 className="section-title">{t('services.title')} <span className="gradient-text">{t('services.titleGrad')}</span></h2>
        <p className="section-subtitle">{t('services.subtitle')}</p>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <motion.div
            key={i}
            className="service-card glass-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="service-icon"><i className={s.icon} /></div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

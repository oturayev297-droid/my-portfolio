import { motion } from 'framer-motion'
import { useLang } from '../lang'

export default function Experience() {
  const { t } = useLang()
  const timeline = [
    { date: t('exp1date'), title: t('exp1title'), icon: 'fas fa-microchip', company: t('exp1company'), desc: t('exp1desc') },
    { date: t('exp2date'), title: t('exp2title'), icon: 'fas fa-chalkboard-teacher', company: t('exp2company'), desc: t('exp2desc') },
    { date: t('exp3date'), title: t('exp3title'), icon: 'fas fa-graduation-cap', company: t('exp3company'), desc: t('exp3desc') },
    { date: t('exp4date'), title: t('exp4title'), icon: 'fas fa-paint-brush', company: t('exp4company'), desc: t('exp4desc') },
  ]

  return (
    <section id="experience" className="experience">
      <div className="text-center">
        <h2 className="section-title">{t('experience.title')} <span className="gradient-text">{t('experience.titleGrad')}</span></h2>
      </div>
      <div className="timeline">
        {timeline.map((item, i) => (
          <motion.div
            key={i}
            className="timeline-block"
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <div className="timeline-dot" />
            <div className="timeline-content glass-card">
              <span className="timeline-date">{item.date}</span>
              <h3>{item.title} <i className={item.icon} /></h3>
              <p className="timeline-company">{item.company}</p>
              <p className="timeline-desc">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

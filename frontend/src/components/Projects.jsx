import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchProjects } from '../api'
import { useLang } from '../lang'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const { t } = useLang()

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  return (
    <section id="projects" className="projects">
      <h2 className="section-title text-center">
        {t('projects.title')} <span className="gradient-text">{t('projects.titleGrad')}</span>
      </h2>
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            {t('projects.empty')}
          </p>
        ) : (
          projects.map((p, i) => (
            <motion.div
              key={i}
              className="project-card glass-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -8 }}
            >
              <div className="project-image">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} />
                ) : (
                  <div className="project-placeholder"><i className="fas fa-image" /></div>
                )}
                <div className="project-strike" />
              </div>
              <div className="project-info">
                <span className="project-cat">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="project-tech">
                  {p.tech_list?.map((t, j) => <span key={j}>{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <p className="section-subtitle">{t('projects.footer')}</p>
      </div>
    </section>
  )
}

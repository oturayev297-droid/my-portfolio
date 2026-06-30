import { motion } from 'framer-motion'

const techs = [
  'PYTHON', 'DJANGO', 'JAVASCRIPT', 'REACT', 'BOOTSTRAP 5',
  'SQL DATABASE', 'AI INTEGRATION', 'HTML5', 'CSS3',
  'API DEVELOPMENT', 'UX/UI DESIGN', 'SWIFT IOS',
]

export default function TechMarquee() {
  return (
    <section className="marquee-section">
      <div className="marquee-track">
        <motion.div
          className="marquee-content"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...techs, ...techs].map((tech, i) => (
            <span key={i} className="marquee-item">
              {tech}
              <i className="fas fa-star-of-life" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

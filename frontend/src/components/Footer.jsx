import { motion } from 'framer-motion'
import { useLang } from '../lang'

export default function Footer() {
  const { t, lang, setLang } = useLang()

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">Tura<span>Yev.Web</span></a>
          <p>{t('footer.desc')}</p>
        </div>
        <div className="footer-links">
          <h5>{t('footer.sections')}</h5>
          <a href="#home">{t('nav.home')}</a>
          <a href="#about">{t('nav.about')}</a>
          <a href="#services">{t('nav.services')}</a>
          <a href="#experience">{t('nav.experience')}</a>
          <a href="#projects">{t('nav.projects')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </div>
        <div className="footer-links">
          <h5>{t('footer.servicesTitle')}</h5>
          <a href="#">Web Design</a>
          <a href="#">Full-stack Dev</a>
          <a href="#">Telegram Bots</a>
          <a href="#">iOS / Android</a>
          <a href="#">UI/UX Design</a>
          <a href="#">Mentorlik</a>
        </div>
        <div className="footer-links">
          <h5>{t('footer.contactTitle')}</h5>
          <a href="https://t.me/Turayevvv_Web" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-telegram" /> @Turayevvv_Web
          </a>
          <a href="#"><i className="fas fa-location-dot" /> {t('contact.locationV')}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 <span>Ozodbek Turayev</span>. {t('footer.copyright')}</p>
        <p>Python · Django · JavaScript · React</p>
      </div>
    </motion.footer>
  )
}

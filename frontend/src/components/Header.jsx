import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../lang'

const sections = ['home', 'about', 'services', 'experience', 'projects', 'contact']

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, t } = useLang()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const langs = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ]

  return (
    <motion.header
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="header-inner">
        <a href="#home" className="logo">
          <span className="logo-bracket">&lt;/</span>
          <span className="logo-text">DEV.MASTER</span>
          <span className="logo-bracket">&gt;</span>
        </a>

        <nav className="desktop-nav">
          {sections.map((s) => (
            <a key={s} href={`#${s}`} className="nav-link">
              {t(`nav.${s}`)}
            </a>
          ))}
          <div className="lang-switch">
            {langs.map((l, i) => (
              <span key={l.code}>
                {i > 0 && <span className="lang-sep">|</span>}
                <a
                  href="#"
                  className={lang === l.code ? 'lang-active' : ''}
                  onClick={(e) => { e.preventDefault(); setLang(l.code) }}
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
        </nav>

        <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span className="bar" /><span className="bar" /><span className="bar" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <button className="close-btn" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-times" />
            </button>
            <nav className="mobile-nav">
              {sections.map((s, i) => (
                <motion.a
                  key={s}
                  href={`#${s}`}
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {t(`nav.${s}`)}
                </motion.a>
              ))}
              <div className="mobile-lang">
                {langs.map((l) => (
                  <a key={l.code} href="#" onClick={(e) => { e.preventDefault(); setLang(l.code); setMenuOpen(false) }}
                    style={{ fontWeight: lang === l.code ? 700 : 400 }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

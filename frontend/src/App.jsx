import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import TechMarquee from './components/TechMarquee'
import About from './components/About'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import AIWidget from './components/AIWidget'
import Footer from './components/Footer'
import SpaceBackground from './components/SpaceBackground'
import './App.css'

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="app">
      <motion.div className="progress-bar" style={{ scaleX }} />

      <div className="cursor-glow" style={{ left: mousePos.x - 150, top: mousePos.y - 150 }} />

      <SpaceBackground />

      <Header />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Services />
        <Pricing />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AIWidget />
    </div>
  )
}

export default App

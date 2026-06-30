import { useRef, useMemo, useState, useCallback, forwardRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Utility ────────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min
const randInt = (min, max) => Math.floor(rand(min, max + 1))

// ─── Syntax-Colored Code Particles ─────────────────────────────
function SyntaxParticles({ count = 1500 }) {
  const ref = useRef()
  const chars = '{}[]<>()/=!+-*&|%$#@?;:.,~^`\'"0123456789abcdefghijklmnopqrstuvwxyz'

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const palette = [
      new THREE.Color('#569cd6'), // blue (keywords)
      new THREE.Color('#ce9178'), // orange (strings)
      new THREE.Color('#dcdcaa'), // yellow (functions)
      new THREE.Color('#6a9955'), // green (comments)
      new THREE.Color('#c586c0'), // purple (decorators)
      new THREE.Color('#9cdcfe'), // cyan (variables)
      new THREE.Color('#d4d4d4'), // white (text)
      new THREE.Color('#f44747'), // red (errors)
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rand(-35, 35)
      pos[i * 3 + 1] = rand(-18, 18)
      pos[i * 3 + 2] = rand(-40, -2)
      const c = palette[randInt(0, palette.length - 1)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      siz[i] = rand(0.04, 0.15)
    }
    return { positions: pos, colors: col, sizes: siz }
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.2 + i * 0.01) * 0.005
      pos[i * 3] += Math.cos(t * 0.15 + i * 0.008) * 0.004
      // Wrap around
      if (pos[i * 3] > 35) pos[i * 3] = -35
      if (pos[i * 3] < -35) pos[i * 3] = 35
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Floating Code Editor Window ──────────────────────────────
function CodeWindow({ position, rotation, code, title, color }) {
  const meshRef = useRef()
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 220
    const ctx = canvas.getContext('2d')

    // Window background
    ctx.fillStyle = '#1e1e1ecc'
    ctx.fillRect(0, 0, 320, 220)

    // Title bar
    ctx.fillStyle = '#323233'
    ctx.fillRect(0, 0, 320, 24)
    ctx.fillStyle = '#888'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.fillText(title || 'untitled.js', 10, 16)

    // Dots
    ctx.fillStyle = '#ff5f56'
    ctx.beginPath()
    ctx.arc(290, 12, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffbd2e'
    ctx.beginPath()
    ctx.arc(272, 12, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#27c93f'
    ctx.beginPath()
    ctx.arc(254, 12, 4, 0, Math.PI * 2)
    ctx.fill()

    // Line numbers
    ctx.fillStyle = '#3a3a3a'
    ctx.font = '12px "Cascadia Code", "Fira Code", monospace'
    for (let i = 0; i < 16; i++) {
      ctx.fillText(`${i + 1}`, 8, 38 + i * 12)
    }

    // Code content with syntax highlighting
    const lines = code.split('\n')
    const colors = {
      kw: '#569cd6',
      str: '#ce9178',
      fn: '#dcdcaa',
      cm: '#6a9955',
      num: '#b5cea8',
      op: '#d4d4d4',
      var: '#9cdcfe',
      cls: '#4ec9b0',
    }

    lines.forEach((line, i) => {
      const y = 38 + i * 12
      ctx.font = '12px "Cascadia Code", "Fira Code", monospace'
      let x = 28
      const tokens = line.split(/(\b(const|let|var|function|class|import|export|return|if|else|for|while|async|await|new|null|true|false|try|catch|throw|def|from)\b|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\/\/.*)|(\d+\.?\d*)|([{}()\[\]=<>!+\-*/&|%?.:,;])|(\b[A-Z]\w*\b))/g)

      tokens.forEach(tok => {
        if (!tok) return
        ctx.fillStyle = '#d4d4d4'
        if (/^\b(const|let|var|function|class|import|export|return|if|else|for|while|async|await|new|null|true|false|try|catch|throw|def|from)\b$/.test(tok)) ctx.fillStyle = colors.kw
        else if (/^["']/.test(tok)) ctx.fillStyle = colors.str
        else if (/^\/\//.test(tok)) ctx.fillStyle = colors.cm
        else if (/^\d/.test(tok)) ctx.fillStyle = colors.num
        else if (/^[{}()\[\]=<>!+\-*/&|%?.:,;]$/.test(tok)) ctx.fillStyle = colors.op
        else if (/^[A-Z]/.test(tok)) ctx.fillStyle = colors.cls

        ctx.fillText(tok, x, y)
        x += ctx.measureText(tok).width + 0.5
      })
    })

    return new THREE.CanvasTexture(canvas)
  }, [code, title])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * 0.3 + position[0]) * 0.002
    }
  })

  return (
    <sprite ref={meshRef} position={position} scale={[6, 4.2, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.NormalBlending}
      />
    </sprite>
  )
}

// ─── Code Editor Manager ─────────────────────────────────────
function CodeWindows() {
  const windows = useMemo(() => {
    const files = [
      {
        title: 'App.jsx',
        code: `import { useState } from 'react'
import Header from './Header'
import Hero from './Hero'

function App() {
  const [lang, setLang] = useState('uz')
  return (
    <div className="app">
      <Header lang={lang} />
      <Hero lang={lang} />
    </div>
  )
}`,
        pos: [-16, 4, -22], rot: [0, 0.3, 0],
      },
      {
        title: 'api.py',
        code: `from django.http import JsonResponse
from .models import Project

def project_list(request):
    projects = Project.objects.all()
    data = [{
        'id': p.id,
        'title': p.title,
        'description': p.description,
    } for p in projects]
    return JsonResponse(data, safe=False)`,
        pos: [14, -2, -24], rot: [0, -0.3, 0],
      },
      {
        title: 'styles.css',
        code: `.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(
    135deg, #0f0f1a, #1a1a2e
  );
  border-radius: 12px;
}`,
        pos: [-6, -4, -30], rot: [0, 0.1, 0],
      },
      {
        title: 'index.html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width">
  <title>Portfolio</title>
  <link rel="stylesheet"
    href="styles.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
        pos: [10, 6, -28], rot: [0, -0.2, 0],
      },
    ]
    return files
  }, [])

  return (
    <group>
      {windows.map((w, i) => (
        <CodeWindow
          key={i}
          position={w.pos}
          rotation={w.rot}
          title={w.title}
          code={w.code}
        />
      ))}
    </group>
  )
}

// ─── Single Language Icon ─────────────────────────────────────
function LangIcon({ icon, index, meshRef }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.arc(32, 32, 28, 0, Math.PI * 2)
    ctx.fillStyle = icon.color + '33'
    ctx.fill()
    ctx.strokeStyle = icon.color
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = icon.color
    ctx.font = 'bold 22px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = icon.color
    ctx.shadowBlur = 8
    ctx.fillText(icon.char, 32, 33)

    return new THREE.CanvasTexture(canvas)
  }, [icon])

  return (
    <sprite
      ref={(el) => { meshRef.current[index] = el }}
      position={icon.position}
      scale={[0.8, 0.8, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
}

// ─── Programming Language Icons ───────────────────────────────
function LangIcons() {
  const icons = useMemo(() => {
    const list = [
      { name: 'Python', color: '#3776AB', char: 'Py' },
      { name: 'JavaScript', color: '#F7DF1E', char: 'JS' },
      { name: 'React', color: '#61DAFB', char: 'Rx' },
      { name: 'Django', color: '#092E20', char: 'Dj' },
      { name: 'TypeScript', color: '#3178C6', char: 'TS' },
      { name: 'Node.js', color: '#339933', char: 'No' },
      { name: 'Docker', color: '#2496ED', char: 'Dk' },
      { name: 'Git', color: '#F05032', char: 'Gi' },
      { name: 'PostgreSQL', color: '#336791', char: 'PQ' },
      { name: 'MongoDB', color: '#47A248', char: 'MD' },
    ]
    return list.map((item) => ({
      ...item,
      position: [rand(-24, 24), rand(-8, 10), rand(-32, -8)],
      floatSpeed: rand(0.3, 0.8),
    }))
  }, [])

  const meshRef = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    icons.forEach((icon, i) => {
      const mesh = meshRef.current[i]
      if (mesh) {
        mesh.position.y += Math.sin(t * icon.floatSpeed + i) * 0.002
        mesh.material.opacity = 0.3 + Math.sin(t * 0.5 + i) * 0.2
      }
    })
  })

  return (
    <group>
      {icons.map((icon, i) => (
        <LangIcon key={i} icon={icon} index={i} meshRef={meshRef} />
      ))}
    </group>
  )
}

// ─── Terminal Window ──────────────────────────────────────────
function TerminalWindow() {
  const groupRef = useRef()
  const textRef = useRef()
  const lines = useMemo(() => [
    '$ npm create vite@latest portfolio',
    '√ Project name: ... portfolio',
    '√ Select framework: » React',
    '√ Select variant: » JavaScript',
    '',
    '$ cd portfolio && npm install',
    '√ Packages installed successfully',
    '',
    '$ npm run dev',
    '',
    '  VITE v6.0.0  ready in 320ms',
    '',
    '  ➜  Local:   http://localhost:5173',
    '  ➜  Network: use --host to expose',
    '',
    '✓ Ready! Happy coding! 🚀',
  ], [])

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 280
    const ctx = canvas.getContext('2d')

    // Terminal bg
    ctx.fillStyle = '#0c0c0c'
    ctx.fillRect(0, 0, 400, 280)

    // Title bar
    ctx.fillStyle = '#2d2d2d'
    ctx.fillRect(0, 0, 400, 24)
    ctx.fillStyle = '#aaa'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('terminal', 200, 16)

    // Close/minimize/maximize dots
    ctx.fillStyle = '#ff5f56'
    ctx.beginPath()
    ctx.arc(20, 12, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffbd2e'
    ctx.beginPath()
    ctx.arc(36, 12, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#27c93f'
    ctx.beginPath()
    ctx.arc(52, 12, 4, 0, Math.PI * 2)
    ctx.fill()

    // Terminal text
    ctx.font = '13px "Cascadia Code", "Fira Code", monospace'
    ctx.textAlign = 'left'

    lines.forEach((line, i) => {
      const y = 36 + i * 16
      if (line.startsWith('$')) {
        ctx.fillStyle = '#89e051' // prompt
        ctx.fillText('$', 10, y)
        ctx.fillStyle = '#d4d4d4'
        ctx.fillText(line.slice(1), 24, y)
      } else if (line.includes('ready') || line.includes('success')) {
        ctx.fillStyle = '#6a9955'
        ctx.fillText(line, 10, y)
      } else if (line.includes('Local:') || line.includes('Network:')) {
        ctx.fillStyle = '#569cd6'
        ctx.fillText(line, 10, y)
      } else if (line.startsWith('√')) {
        ctx.fillStyle = '#89e051'
        ctx.fillText(line, 10, y)
      } else if (line.startsWith('✓')) {
        ctx.fillStyle = '#89e051'
        ctx.fillText(line, 10, y)
      } else {
        ctx.fillStyle = '#888'
        ctx.fillText(line, 10, y)
      }
    })

    return new THREE.CanvasTexture(canvas)
  }, [lines])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.5
    }
  })

  return (
    <group ref={groupRef} position={[-12, -2, -18]}>
      <sprite scale={[7, 4.9, 1]}>
        <spriteMaterial
          map={texture}
          transparent
          opacity={0.8}
          depthWrite={false}
          sizeAttenuation
        />
      </sprite>
    </group>
  )
}

// ─── Tech Connection Lines ───────────────────────────────────
function ConnectionLines() {
  const groupRef = useRef()
  const nodes = useMemo(() => {
    const n = []
    for (let i = 0; i < 30; i++) {
      n.push({
        pos: [rand(-28, 28), rand(-10, 10), rand(-32, -6)],
        connections: [],
      })
    }
    // Connect nearby nodes
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[i].pos[0] - n[j].pos[0]
        const dy = n[i].pos[1] - n[j].pos[1]
        const dz = n[i].pos[2] - n[j].pos[2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 7 && Math.random() > 0.85) {
          n[i].connections.push(j)
        }
      }
    }
    return n
  }, [])

  const linePositions = useMemo(() => {
    const positions = []
    nodes.forEach((node, i) => {
      node.connections.forEach((j) => {
        positions.push(...node.pos, ...nodes[j].pos)
      })
    })
    return new Float32Array(positions)
  }, [nodes])

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#569cd6" transparent opacity={0.06} />
      </lineSegments>
      {/* Glowing nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#569cd6" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Tech Grid Floor ─────────────────────────────────────────
function TechGrid() {
  const gridRef = useRef()

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = ((clock.getElapsedTime() * 0.3) % 2) - 1
    }
  })

  return (
    <group>
      {/* Main grid */}
      <gridHelper
        ref={gridRef}
        args={[70, 50, '#2d4a7a', '#1a2744']}
        position={[0, -9.5, 0]}
      />
      {/* Glow floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9.55, 0]}>
        <planeGeometry args={[68, 68]} />
        <meshBasicMaterial color="#1a3a6a" transparent opacity={0.03} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Horizontal scan line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9.3, 0]}>
        <planeGeometry args={[70, 0.3]} />
        <meshBasicMaterial color="#569cd6" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

// ─── Database/Server Rack Visual ─────────────────────────────
function ServerRack() {
  const groupRef = useRef()

  const rackData = useMemo(() => {
    const units = []
    for (let i = 0; i < 8; i++) {
      units.push({
        y: -3 + i * 0.6,
        active: Math.random() > 0.3,
        color: ['#569cd6', '#6a9955', '#ce9178', '#c586c0'][randInt(0, 3)],
        blinkSpeed: rand(1, 3),
      })
    }
    return units
  }, [])

  const ledsRef = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    rackData.forEach((unit, i) => {
      const led = ledsRef.current[i]
      if (led) {
        const blink = Math.sin(t * unit.blinkSpeed) > 0.3
        led.material.opacity = blink ? 0.8 : 0.1
      }
    })
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.15) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[20, 2, -20]}>
      {/* Rack frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 6, 1.2]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.6} />
      </mesh>
      {/* Server units */}
      {rackData.map((unit, i) => (
        <group key={i}>
          <mesh position={[0, unit.y, 0]}>
            <boxGeometry args={[2.2, 0.4, 1]} />
            <meshBasicMaterial color={unit.color} transparent opacity={0.15} />
          </mesh>
          {/* LED */}
          <mesh
            ref={(el) => (ledsRef.current[i] = el)}
            position={[-0.8, unit.y, 0.6]}
          >
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color={unit.color} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── Code Lightning ─────────────────────────────────────────
function CodeLightning({ start, end, onComplete }) {
  const lineRef = useRef()
  const glowRef = useRef()
  const lifeRef = useRef({ born: Date.now(), duration: rand(100, 400) })

  const segments = useMemo(() => {
    const points = []
    const count = randInt(8, 16)
    for (let i = 0; i <= count; i++) {
      const t = i / count
      const offset = (1 - t) * rand(0.5, 5)
      points.push(
        start[0] + (end[0] - start[0]) * t + (Math.random() - 0.5) * offset,
        start[1] + (end[1] - start[1]) * t + (Math.random() - 0.5) * offset,
        start[2] + (end[2] - start[2]) * t + (Math.random() - 0.5) * offset,
      )
    }
    return new Float32Array(points)
  }, [start, end])

  const color = useMemo(() => {
    return ['#569cd6', '#9cdcfe', '#4ec9b0', '#c586c0'][randInt(0, 3)]
  }, [])

  useFrame(() => {
    const elapsed = Date.now() - lifeRef.current.born
    const progress = elapsed / lifeRef.current.duration

    if (progress >= 1) {
      onComplete?.()
      return
    }

    const opacity = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85

    if (lineRef.current) lineRef.current.material.opacity = opacity
    if (glowRef.current) {
      glowRef.current.material.opacity = opacity * 0.2
      glowRef.current.scale.set(1 + (1 - progress) * 3, 1 + (1 - progress) * 3, 1)
    }
  })

  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={1} />
      </line>
      <line ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.2} />
      </line>
      <mesh position={end}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// ─── Lightning Manager ──────────────────────────────────────
function LightningManager() {
  const [bolts, setBolts] = useState([])
  const nextId = useRef(0)
  const lastTime = useRef(0)

  const generate = useCallback(() => {
    const startX = rand(-25, 25)
    const startZ = rand(-30, -12)
    const id = nextId.current++
    setBolts(prev => [...prev, {
      id,
      start: [startX, rand(4, 12), startZ],
      end: [startX + rand(-8, 8), rand(-6, 2), startZ + rand(-4, 4)],
    }])
  }, [])

  const remove = useCallback((id) => {
    setBolts(prev => prev.filter(b => b.id !== id))
  }, [])

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime()
    if (now - lastTime.current > rand(0.5, 2.5)) {
      lastTime.current = now
      generate()
      if (Math.random() > 0.7) {
        setTimeout(() => generate(), rand(50, 150))
      }
    }
  })

  return (
    <group>
      {bolts.map(b => (
        <CodeLightning
          key={b.id}
          start={b.start}
          end={b.end}
          onComplete={() => remove(b.id)}
        />
      ))}
    </group>
  )
}

// ─── Floating Code Snippet Lines ─────────────────────────────
function FloatingSnippets() {
  const refs = useRef([])

  const snippets = useMemo(() => {
    const terms = [
      'const', 'function', '=>', 'import', 'export',
      'class', 'return', 'await', 'async', 'new',
      'try', 'catch', 'throw', 'yield', 'delete',
      'typeof', 'instanceof', 'void', 'this', 'super',
      'def', 'from', 'as', 'with', 'lambda',
      'map', 'filter', 'reduce', 'fetch', 'axios',
      'useEffect', 'useState', 'useRef', 'createContext',
      'GET', 'POST', 'PUT', 'DELETE', 'PATCH',
      'docker', 'nginx', 'redis', 'celery', 'gunicorn',
      'JSON', 'HTML', 'CSS', 'SQL', 'NoSQL',
    ]
    return Array.from({ length: 50 }, (_, i) => ({
      text: terms[i % terms.length],
      pos: [rand(-30, 30), rand(-10, 12), rand(-36, -4)],
      color: ['#569cd6', '#9cdcfe', '#ce9178', '#c586c0', '#6a9955', '#dcdcaa'][randInt(0, 5)],
      speed: rand(0.1, 0.3),
      size: rand(0.3, 0.7),
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    snippets.forEach((s, i) => {
      const mesh = refs.current[i]
      if (mesh) {
        mesh.position.y += Math.sin(t * s.speed + i * 0.5) * 0.003
      }
    })
  })

  return (
    <group>
      {snippets.map((s, i) => (
        <FloatingSnippet
          key={i}
          ref={(el) => (refs.current[i] = el)}
          text={s.text}
          position={s.pos}
          color={s.color}
          size={s.size}
        />
      ))}
    </group>
  )
}

const FloatingSnippet = forwardRef(({ text, position, color, size }, ref) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 36
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 128, 36)

    // Glow
    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.font = 'bold 18px "Cascadia Code", "Fira Code", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.fillText(text, 64, 20)

    // Core (white-ish)
    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = 0.7
    ctx.fillText(text, 64, 20)
    ctx.globalAlpha = 1

    return new THREE.CanvasTexture(canvas)
  }, [text, color])

  return (
    <sprite ref={ref} position={position} scale={[size * 2, size * 0.6, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
})

// ─── Camera Orbit ────────────────────────────────────────────
function CameraController() {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.02) * 4
    camera.position.y = 2 + Math.sin(t * 0.04) * 1.5
    camera.lookAt(0, 0, -20)
  })

  return null
}

// ─── Main Scene ──────────────────────────────────────────────
function Scene() {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 10, -15]} intensity={0.8} color="#569cd6" />
      <pointLight position={[-15, -5, -20]} intensity={0.4} color="#c586c0" />

      <fog attach="fog" args={['#0a0a1a', 15, 55]} />

      <TechGrid />
      <SyntaxParticles count={1200} />
      <FloatingSnippets />
      <ConnectionLines />
      <CodeWindows />
      <LangIcons />
      <TerminalWindow />
      <ServerRack />
      <LightningManager />
      <CameraController />
    </group>
  )
}

// ─── Exported Component ──────────────────────────────────────
export default function SpaceBackground() {
  return (
    <div className="space-background">
      <Canvas
        camera={{ position: [0, 3, 20], fov: 60, far: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

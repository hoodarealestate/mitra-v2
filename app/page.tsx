'use client'
import { useState, useRef, useEffect } from 'react'
import { ZEFFY_LINKS, CONNECT_CATEGORIES } from '@/lib/constants'

const NAV_ITEMS = [
  { label: 'Mitra AI', id: 'ai' },
  { label: 'Directory', id: 'directory' },
  { label: 'Certify', id: 'certify' },
  { label: 'Connect', id: 'connect' },
  { label: 'Civic', id: 'civic' },
  { label: 'Articles', id: 'blog' },
  { label: 'Join', id: 'join' },
]

const HERO_SLIDES = [
  { url: 'https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?w=1400&q=80', caption: 'Jagannath Temple, Puri' },
  { url: 'https://images.unsplash.com/photo-1566300141301-ab0577dcba1c?w=1400&q=80', caption: 'Sacred Temple at Night' },
  { url: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=1400&q=80', caption: 'Ancient Hindu Temple' },
  { url: 'https://images.unsplash.com/photo-1565195161077-f5c5f61f9ea2?w=1400&q=80', caption: 'Vedic Temple Architecture' },
]

const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?w=800&q=80', title: 'Gopuram', sub: 'Temple Tower — Sacred Gateway' },
  { url: 'https://images.unsplash.com/photo-1632962237468-0705d7e7b534?w=800&q=80', title: 'Konark', sub: 'Sun Temple — Stone Legacy' },
  { url: 'https://images.unsplash.com/photo-1601815264039-67c8ba1a7f98?w=800&q=80', title: 'Mandir', sub: 'Place of Worship' },
  { url: 'https://images.unsplash.com/photo-1715876722520-02ccc9248dab?w=800&q=80', title: 'Shikhara', sub: 'Temple Spire — Reaching the Divine' },
  { url: 'https://images.unsplash.com/photo-1663511059029-e50075e538c6?w=800&q=80', title: 'Harmandir Sahib', sub: 'Golden Temple, Amritsar' },
  { url: 'https://images.unsplash.com/photo-1630764883473-e8c2056f0589?w=800&q=80', title: 'Hawan · Yagya', sub: 'Sacred Vedic Fire Ceremony' },
]

const SUGGESTED = [
  { en: "Why do we light a diya? What does it mean spiritually?", hi: "हम दीया क्यों जलाते हैं?" },
  { en: "My friend says Hindus worship idols — how do I explain?", hi: "मूर्तिपूजा के बारे में क्या जवाब दूं?" },
  { en: "What does the Bhagavad Gita say about stress?", hi: "तनाव पर गीता क्या कहती है?" },
  { en: "What is the soul? Where do we go after death?", hi: "आत्मा क्या है? मृत्यु के बाद क्या होता है?" },
  { en: "How can I live a truly dharmic life today?", hi: "आज धर्मपूर्ण जीवन कैसे जिएं?" },
  { en: "Why is Hanuman not a monkey? The real story.", hi: "हनुमान जी की असली कहानी क्या है?" },
]

const formatMessage = (text: string) => text.split('\n').map((line, i) => {
  if (!line.trim()) return <br key={i} />
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  const formatted = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p)
  return <p key={i} style={{ margin: '4px 0', lineHeight: 1.8 }}>{formatted}</p>
})

// Mandala SVG component
function Mandala({ size = 400, opacity = 0.12 }: { size?: number; opacity?: number }) {
  const petals = 12
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ opacity, position: 'absolute' }}>
      <g transform="translate(200,200)">
        {/* Outer rotating ring */}
        <g style={{ animation: 'rotateMandala 40s linear infinite', transformOrigin: '0 0' }}>
          {Array.from({ length: petals }).map((_, i) => (
            <ellipse key={i} cx={0} cy={-160} rx={12} ry={40} fill="none" stroke="#F0C060" strokeWidth="1"
              transform={`rotate(${i * (360 / petals)})`} />
          ))}
          <circle cx={0} cy={0} r={160} fill="none" stroke="#F0C060" strokeWidth="0.5" />
          <circle cx={0} cy={0} r={140} fill="none" stroke="#D4560A" strokeWidth="0.5" />
        </g>
        {/* Middle counter-rotating ring */}
        <g style={{ animation: 'rotateMandalaRev 25s linear infinite', transformOrigin: '0 0' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 45})`}>
              <polygon points="0,-110 8,-90 -8,-90" fill="#F0C060" opacity={0.6} />
            </g>
          ))}
          <circle cx={0} cy={0} r={100} fill="none" stroke="#F0C060" strokeWidth="0.5" />
        </g>
        {/* Inner ring */}
        <g style={{ animation: 'rotateMandala 15s linear infinite', transformOrigin: '0 0' }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1={0} y1={-40} x2={0} y2={-70} stroke="#D4560A" strokeWidth="1"
              transform={`rotate(${i * 22.5})`} />
          ))}
          <circle cx={0} cy={0} r={40} fill="none" stroke="#F0C060" strokeWidth="1" />
        </g>
        {/* Center */}
        <circle cx={0} cy={0} r={20} fill="none" stroke="#F0C060" strokeWidth="1.5" />
        <circle cx={0} cy={0} r={8} fill="#F0C060" opacity={0.8} />
      </g>
    </svg>
  )
}

// Floating particles component
function Particles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          bottom: '-20px',
          width: i % 3 === 0 ? '8px' : '4px',
          height: i % 3 === 0 ? '8px' : '4px',
          background: i % 2 === 0 ? '#F0C060' : '#D4560A',
          borderRadius: '50%',
          animation: `particleFloat ${8 + Math.random() * 12}s ${Math.random() * 10}s linear infinite`,
          opacity: 0,
        }} />
      ))}
    </div>
  )
}

export default function Home() {
  const [active, setActive] = useState('home')
  const [heroSlide, setHeroSlide] = useState(0)
  const [messages, setMessages] = useState<{role:string;content:string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'en'|'hi'>('en')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [countersVisible, setCountersVisible] = useState(false)
  const [galleryHover, setGalleryHover] = useState(-1)
  const [mobileNav, setMobileNav] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCountersVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput(''); setShowSuggestions(false)
    const newHistory = [...messages, { role: 'user', content: userText }]
    setMessages(newHistory); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newHistory }) })
      const data = await res.json()
      setMessages([...newHistory, { role: 'assistant', content: data.reply }])
    } catch { setMessages([...newHistory, { role: 'assistant', content: 'Connection error. Please try again.' }]) }
    setLoading(false)
  }

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0E0400 0%, #1C0A00 40%, #2C1000 70%, #1C0A00 100%)',
    position: 'sticky', top: 0, zIndex: 300,
    borderBottom: '1px solid rgba(240,192,96,0.25)',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>

      {/* ═══ HEADER ═══ */}
      <header style={headerStyle}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          <div onClick={() => setActive('home')} style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F0C060, #D4560A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontFamily: 'var(--font-dev)', color: '#1C0A00',
              animation: 'glowPulse 3s ease-in-out infinite',
              flexShrink: 0,
            }}>ॐ</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#FAF3E0', lineHeight: 1.1 }}>Mitra · मित्र</div>
              <div style={{ fontSize: '0.6rem', color: '#C9922A', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Canadian Hindu Community · canadianhindu.ca</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActive(item.id)} style={{
                padding: '8px 18px', borderRadius: 0, border: 'none', cursor: 'pointer',
                background: active === item.id ? 'rgba(212,86,10,0.75)' : 'transparent',
                color: active === item.id ? '#FAF3E0' : 'rgba(240,192,96,0.75)',
                fontSize: '0.83rem', fontFamily: 'var(--font-body)', letterSpacing: '0.5px',
                borderBottom: active === item.id ? '2px solid #F0C060' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { if (active !== item.id) { (e.currentTarget as any).style.color = '#F0C060'; (e.currentTarget as any).style.background = 'rgba(255,255,255,0.06)' }}}
                onMouseOut={e => { if (active !== item.id) { (e.currentTarget as any).style.color = 'rgba(240,192,96,0.75)'; (e.currentTarget as any).style.background = 'transparent' }}}>
                {item.label}
              </button>
            ))}
            <div style={{ width: 1, height: 28, background: 'rgba(240,192,96,0.2)', margin: '0 10px' }} />
            {(['en','hi'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '6px 12px', border: 'none', cursor: 'pointer',
                background: lang === l ? 'rgba(240,192,96,0.15)' : 'transparent',
                color: lang === l ? '#F0C060' : 'rgba(240,192,96,0.4)',
                fontSize: '0.78rem', fontWeight: 'bold', borderRadius: 4,
              }}>{l === 'en' ? 'EN' : 'हि'}</button>
            ))}
          </nav>
        </div>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #F0C060 20%, #D4560A 40%, #F0C060 60%, #D4560A 80%, transparent 100%)', animation: 'shimmerGold 4s linear infinite', backgroundSize: '200% 100%' }} />
      </header>

      {/* ═══ HOME ═══ */}
      {active === 'home' && (
        <>
          {/* HERO */}
          <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            {HERO_SLIDES.map((slide, i) => (
              <div key={i} style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${slide.url})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: heroSlide === i ? 1 : 0,
                transition: 'opacity 2s ease-in-out',
                animation: heroSlide === i ? 'kenBurns 8s ease-out forwards' : 'none',
              }} />
            ))}
            {/* Multi-layer overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,4,0,0.4) 0%, rgba(28,10,0,0.55) 40%, rgba(28,10,0,0.88) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(14,4,0,0.5) 100%)' }} />

            {/* Animated particles */}
            <Particles />

            {/* Mandala decorations */}
            <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)' }}>
              <Mandala size={320} opacity={0.15} />
            </div>
            <div style={{ position: 'absolute', top: '50%', right: '3%', transform: 'translateY(-50%)' }}>
              <Mandala size={260} opacity={0.1} />
            </div>

            {/* Hero content */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 24px',
            }}>
              {/* Floating OM */}
              <div style={{
                fontFamily: 'var(--font-dev)', fontSize: '7rem', color: '#F0C060',
                textShadow: '0 0 60px rgba(240,192,96,0.8), 0 0 120px rgba(212,86,10,0.4)',
                animation: 'floatOM 5s ease-in-out infinite',
                lineHeight: 1, marginBottom: 16,
              }}>ॐ</div>

              <div style={{ animation: 'fadeUp 1s 0.2s ease both' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                  color: '#FAF3E0', lineHeight: 1.05, marginBottom: 20,
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                }}>
                  {lang === 'hi' ? 'मित्र में स्वागत है' : 'Welcome to Mitra'}
                </h1>
              </div>

              <div style={{ animation: 'fadeUp 1s 0.5s ease both' }}>
                <p style={{
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                  color: 'rgba(250,243,224,0.88)',
                  maxWidth: 680, marginBottom: 32,
                  fontStyle: 'italic', lineHeight: 1.7,
                  textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}>
                  {lang === 'hi'
                    ? 'कनाडा में हिन्दू, सिख, बौद्ध और जैन समुदाय का एकमात्र विश्वसनीय मंच'
                    : "Canada's trusted home for the Hindu, Sikh, Buddhist & Jain community"}
                </p>
              </div>

              <div style={{ animation: 'fadeUp 1s 0.7s ease both', marginBottom: 40 }}>
                <div style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-dev)', fontSize: '1.05rem', color: '#F0C060',
                  padding: '10px 32px', borderRadius: 40,
                  border: '1px solid rgba(240,192,96,0.5)',
                  background: 'rgba(28,10,0,0.4)',
                  backdropFilter: 'blur(10px)',
                  animation: 'borderDance 3s ease-in-out infinite',
                  letterSpacing: '0.5px',
                }}>
                  धर्मो रक्षति रक्षितः
                  <span style={{ color: 'rgba(240,192,96,0.6)', marginLeft: 8, fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>— Dharma Protected, Protects</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20, animation: 'fadeUp 1s 0.9s ease both', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => setActive('ai')} style={{
                  padding: '18px 44px',
                  background: 'linear-gradient(135deg, #D4560A, #8B2E00)',
                  color: '#FAF3E0', border: 'none', borderRadius: 4, cursor: 'pointer',
                  fontSize: '1.05rem', fontFamily: 'var(--font-display)',
                  boxShadow: '0 8px 32px rgba(212,86,10,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  letterSpacing: '0.5px',
                }}
                  onMouseOver={e => { (e.currentTarget as any).style.transform = 'translateY(-3px)'; (e.currentTarget as any).style.boxShadow = '0 16px 48px rgba(212,86,10,0.6)' }}
                  onMouseOut={e => { (e.currentTarget as any).style.transform = 'translateY(0)'; (e.currentTarget as any).style.boxShadow = '0 8px 32px rgba(212,86,10,0.5)' }}>
                  Ask Mitra AI →
                </button>
                <button onClick={() => setActive('join')} style={{
                  padding: '18px 44px',
                  background: 'transparent',
                  color: '#F0C060', border: '1.5px solid rgba(240,192,96,0.6)', borderRadius: 4, cursor: 'pointer',
                  fontSize: '1.05rem', fontFamily: 'var(--font-display)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s',
                }}
                  onMouseOver={e => { (e.currentTarget as any).style.background = 'rgba(240,192,96,0.1)'; (e.currentTarget as any).style.borderColor = '#F0C060' }}
                  onMouseOut={e => { (e.currentTarget as any).style.background = 'transparent'; (e.currentTarget as any).style.borderColor = 'rgba(240,192,96,0.6)' }}>
                  Join for $1 CAD
                </button>
              </div>
            </div>

            {/* Slide caption */}
            <div style={{
              position: 'absolute', bottom: 32, right: 40,
              color: 'rgba(240,192,96,0.7)', fontSize: '0.82rem', letterSpacing: '2px',
              textTransform: 'uppercase', fontFamily: 'var(--font-body)',
              animation: 'fadeIn 0.5s ease',
            }}>{HERO_SLIDES[heroSlide].caption}</div>

            {/* Slide dots */}
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setHeroSlide(i)} style={{
                  width: heroSlide === i ? 28 : 8, height: 8, borderRadius: 4, border: 'none',
                  background: heroSlide === i ? '#F0C060' : 'rgba(240,192,96,0.3)',
                  cursor: 'pointer', transition: 'all 0.4s ease', padding: 0,
                }} />
              ))}
            </div>
          </div>

          {/* ANIMATED STATS */}
          <div ref={statsRef} style={{ background: 'linear-gradient(135deg, #0E0400, #1C0A00, #0E0400)', padding: '60px 24px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
              {[
                { num: '659', suffix: '+', label: 'Community Members', sub: 'across Canada' },
                { num: '$1', suffix: '', label: 'To Join', sub: 'identity verified' },
                { num: '25', suffix: '%', label: 'To Partner Orgs', sub: 'per certification' },
                { num: '14', suffix: '', label: 'Vedic Scriptures', sub: 'in Mitra AI' },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: 'center', padding: '32px 24px',
                  borderRight: i < 3 ? '1px solid rgba(240,192,96,0.12)' : 'none',
                  animation: countersVisible ? `countUp 0.6s ${i * 0.15}s ease both` : 'none',
                  opacity: countersVisible ? 1 : 0,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                    background: 'linear-gradient(135deg, #F0C060, #D4560A)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', lineHeight: 1,
                  }}>{s.num}{s.suffix}</div>
                  <div style={{ color: '#FAF3E0', fontSize: '1rem', fontWeight: 600, marginTop: 8, letterSpacing: '0.3px' }}>{s.label}</div>
                  <div style={{ color: 'rgba(201,146,42,0.6)', fontSize: '0.82rem', marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY SECTION */}
          <div style={{ padding: '100px 24px 80px', background: 'var(--cream)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 60, animation: 'fadeUp 0.8s ease both' }}>
                <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1.2rem', color: 'var(--saffron)', letterSpacing: '2px', marginBottom: 8 }}>सनातन धर्म</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 4rem)', color: 'var(--dark)', lineHeight: 1.15 }}>
                  Ancient Wisdom.<br />
                  <span style={{ background: 'linear-gradient(135deg, #D4560A, #C9922A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Modern Community.
                  </span>
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                {GALLERY.map((item, i) => (
                  <div key={i}
                    style={{
                      position: 'relative', overflow: 'hidden', borderRadius: 8,
                      aspectRatio: i === 0 || i === 5 ? '2/3' : '3/4',
                      gridColumn: i === 0 ? 'span 2' : i === 5 ? 'span 2' : 'span 1',
                      cursor: 'pointer',
                      boxShadow: galleryHover === i ? '0 20px 60px rgba(28,10,0,0.3)' : '0 4px 20px rgba(28,10,0,0.12)',
                      transition: 'box-shadow 0.4s, transform 0.4s',
                      transform: galleryHover === i ? 'scale(1.02)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setGalleryHover(i)}
                    onMouseLeave={() => setGalleryHover(-1)}>
                    <img src={item.url} alt={item.title} style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.6s ease',
                      transform: galleryHover === i ? 'scale(1.08)' : 'scale(1)',
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: galleryHover === i
                        ? 'linear-gradient(transparent 30%, rgba(28,10,0,0.85) 100%)'
                        : 'linear-gradient(transparent 50%, rgba(28,10,0,0.7) 100%)',
                      transition: 'background 0.4s',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px',
                      transform: galleryHover === i ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'transform 0.4s',
                    }}>
                      <div style={{ color: '#F0C060', fontFamily: 'var(--font-display)', fontSize: i === 0 || i === 5 ? '1.1rem' : '0.9rem' }}>{item.title}</div>
                      <div style={{ color: 'rgba(250,243,224,0.75)', fontSize: '0.78rem', fontStyle: 'italic', marginTop: 2, opacity: galleryHover === i ? 1 : 0, transition: 'opacity 0.3s' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div style={{ background: 'linear-gradient(180deg, #F5E6C4 0%, #FAF3E0 100%)', padding: '90px 24px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', color: 'var(--dark)' }}>Everything Your Community Needs</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
                {[
                  { icon: '🤖', title: 'Mitra AI', color: '#D4560A', id: 'ai', desc: 'Ask anything about dharma, Vedic wisdom, and Hindu identity. Powered by 14 ancient scriptures.', btn: 'Ask Mitra' },
                  { icon: '🏅', title: 'Dharmic Certification', color: '#C9922A', id: 'certify', desc: 'Official certification for Hindu, Sikh, Buddhist & Jain businesses. Revenue split 25/25/50.', btn: 'Get Certified — $100/yr' },
                  { icon: '🏢', title: 'Business Directory', color: '#7B1616', id: 'directory', desc: 'Find verified Dharmic businesses across Canada. Every listing is identity-verified.', btn: 'Browse Directory' },
                  { icon: '📋', title: 'Connect Board', color: '#1A4A2E', id: 'connect', desc: 'Find community members in your city for sports, arts, seva and more. Free for verified members.', btn: 'Connect Now' },
                  { icon: '🗳️', title: 'Civic Connect', color: '#2C4A82', id: 'civic', desc: 'Connect with Dharmic candidates in your riding. Postal code sorted. Non-partisan.', btn: 'Explore Civic' },
                  { icon: '🪪', title: 'Member Card', color: '#5C2200', id: 'join', desc: 'Verified Dharmic Member Card for just $1 CAD. QR-scannable, valid 1 year.', btn: 'Join for $1' },
                ].map((f, i) => (
                  <div key={f.id} style={{
                    background: 'white', borderRadius: 2,
                    borderLeft: `4px solid ${f.color}`,
                    padding: '36px 32px',
                    boxShadow: '0 2px 24px rgba(28,10,0,0.07)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    animation: `fadeUp 0.6s ${i * 0.08}s ease both`,
                    cursor: 'pointer',
                  }}
                    onClick={() => setActive(f.id)}
                    onMouseOver={e => { (e.currentTarget as any).style.transform = 'translateY(-8px) translateX(4px)'; (e.currentTarget as any).style.boxShadow = '0 20px 60px rgba(28,10,0,0.15)' }}
                    onMouseOut={e => { (e.currentTarget as any).style.transform = 'translateY(0) translateX(0)'; (e.currentTarget as any).style.boxShadow = '0 2px 24px rgba(28,10,0,0.07)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 18 }}>{f.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--dark)', marginBottom: 12 }}>{f.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', lineHeight: 1.75, marginBottom: 24 }}>{f.desc}</p>
                    <span style={{ color: f.color, fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.3px' }}>{f.btn} →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DHARMIC SPLIT — cinematic section */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              background: `url(https://images.unsplash.com/photo-1677211352662-30e7775c7ce8?w=1400&q=80) center/cover fixed`,
              padding: '120px 24px',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,4,0,0.82)' }} />
              <Particles />
              <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center', color: '#FAF3E0' }}>
                <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1.3rem', color: '#F0C060', marginBottom: 14, letterSpacing: '1px' }}>धर्मो रक्षति रक्षितः</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', marginBottom: 16, lineHeight: 1.15 }}>
                  Every $100 Certification<br />Gives Back to the Community
                </h2>
                <p style={{ fontSize: '1.15rem', color: 'rgba(250,243,224,0.75)', marginBottom: 72, fontStyle: 'italic', maxWidth: 600, margin: '0 auto 72px' }}>
                  Dharma in business means giving back — every certification directly supports temples, sabhas, and charities
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginBottom: 56 }}>
                  {[
                    { pct: '25%', label: 'Partner Organization', sub: 'Temple, sabha, or referring org', icon: '🛕' },
                    { pct: '25%', label: 'Dharmic Charity', sub: 'Selected quarterly with partners', icon: '🙏' },
                    { pct: '50%', label: 'Platform & Programs', sub: 'Keeping Mitra free & growing', icon: '🪷' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(240,192,96,0.2)',
                      borderRadius: 8, padding: '44px 28px',
                      backdropFilter: 'blur(12px)',
                      transition: 'transform 0.3s, border-color 0.3s',
                    }}
                      onMouseOver={e => { (e.currentTarget as any).style.transform = 'translateY(-8px)'; (e.currentTarget as any).style.borderColor = 'rgba(240,192,96,0.6)' }}
                      onMouseOut={e => { (e.currentTarget as any).style.transform = 'translateY(0)'; (e.currentTarget as any).style.borderColor = 'rgba(240,192,96,0.2)' }}>
                      <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>{item.icon}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', background: 'linear-gradient(135deg, #F0C060, #D4560A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{item.pct}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, margin: '12px 0 6px', color: '#FAF3E0' }}>{item.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(240,192,96,0.6)' }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
                <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', padding: '20px 56px',
                  background: 'linear-gradient(135deg, #F0C060, #D4560A)',
                  color: '#1C0A00', borderRadius: 4, fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem', textDecoration: 'none',
                  boxShadow: '0 10px 40px rgba(240,192,96,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseOver={e => { (e.currentTarget as any).style.transform = 'translateY(-4px)'; (e.currentTarget as any).style.boxShadow = '0 20px 60px rgba(240,192,96,0.5)' }}
                  onMouseOut={e => { (e.currentTarget as any).style.transform = 'translateY(0)'; (e.currentTarget as any).style.boxShadow = '0 10px 40px rgba(240,192,96,0.35)' }}>
                  Apply for Dharmic Certification — $100/yr 🪷
                </a>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer style={{ background: '#0E0400', borderTop: '1px solid rgba(240,192,96,0.1)', padding: '64px 24px 40px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F0C060, #D4560A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontFamily: 'var(--font-dev)', color: '#1C0A00' }}>ॐ</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1rem', color: '#F0C060', marginBottom: 12 }}>धर्मो रक्षति रक्षितः</div>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(201,160,96,0.6)', lineHeight: 1.8, maxWidth: 320 }}>A Canadian Hindu Volunteers initiative serving the Hindu, Sikh, Buddhist & Jain community across Canada.</p>
                  <div style={{ marginTop: 16, fontSize: '0.82rem', color: 'rgba(201,160,96,0.4)' }}>canadianhinduvolunteers@gmail.com</div>
                </div>
                {[
                  { title: 'Platform', links: ['Mitra AI', 'Directory', 'Certify', 'Connect Board', 'Civic Connect'] },
                  { title: 'Community', links: ['Join for $1', 'Dharmic Certification', 'Articles', 'Partner With Us'] },
                  { title: 'Organization', links: ['canadianhindu.ca', 'About Us', 'Contact', 'Admin'] },
                ].map((col, i) => (
                  <div key={i}>
                    <div style={{ color: '#FAF3E0', fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, opacity: 0.5 }}>{col.title}</div>
                    {col.links.map(link => (
                      <div key={link} style={{ color: 'rgba(201,160,96,0.5)', fontSize: '0.9rem', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#F0C060')}
                        onMouseOut={e => (e.currentTarget.style.color = 'rgba(201,160,96,0.5)')}>{link}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(240,192,96,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(201,160,96,0.3)', flexWrap: 'wrap', gap: 12 }}>
                <div>© 2025 Canadian Hindu Volunteers</div>
                <div>For educational & spiritual guidance only · Not a substitute for professional advice</div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ═══ AI PAGE ═══ */}
      {active === 'ai' && (
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.6s ease both' }}>
            <div style={{ fontFamily: 'var(--font-dev)', fontSize: '4rem', color: 'var(--saffron)', marginBottom: 8, animation: 'floatOM 4s ease-in-out infinite' }}>ॐ</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', color: 'var(--dark)', marginBottom: 12 }}>Mitra — Your Vedic Guide</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Ask anything · 14 scriptures · Groq powered · English & Hindi</p>
          </div>
          <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 60px rgba(28,10,0,0.12)', border: '1px solid rgba(201,146,42,0.15)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0E0400, #1C0A00, #3D1500)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #F0C060, #D4560A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontFamily: 'var(--font-dev)', animation: 'glowPulse 3s infinite' }}>ॐ</div>
                <div>
                  <div style={{ color: '#FAF3E0', fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Mitra · मित्र</div>
                  <div style={{ color: '#C9922A', fontSize: '0.65rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Vedic AI Guide · 14 Scriptures · Groq Powered</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['en','hi'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', background: lang === l ? 'rgba(240,192,96,0.9)' : 'rgba(255,255,255,0.08)', color: lang === l ? '#1C0A00' : '#F0C060', fontSize: '0.78rem', fontWeight: 'bold' }}>{l === 'en' ? 'EN' : 'हि'}</button>
                ))}
                {messages.length > 0 && <button onClick={() => { setMessages([]); setShowSuggestions(true) }} style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(240,192,96,0.2)', background: 'transparent', color: '#C9922A', fontSize: '0.75rem', cursor: 'pointer' }}>New Chat</button>}
              </div>
            </div>
            <div style={{ height: 500, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20, background: '#FFFDF8' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '4.5rem', fontFamily: 'var(--font-dev)', color: 'var(--saffron)', marginBottom: 16, animation: 'floatOM 4s ease-in-out infinite' }}>ॐ</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--dark)', marginBottom: 8 }}>{lang === 'hi' ? 'मित्र से कोई भी प्रश्न पूछें' : 'Ask Mitra anything'}</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Vedic wisdom for every question, every age, every moment</div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #8B2E00, #D4560A)' : 'white',
                  color: msg.role === 'user' ? '#FAF3E0' : 'var(--text)',
                  borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                  padding: '16px 22px', fontSize: '1rem', lineHeight: 1.75,
                  border: msg.role === 'assistant' ? '1px solid rgba(201,146,42,0.15)' : 'none',
                  boxShadow: '0 2px 16px rgba(28,10,0,0.07)',
                  animation: 'fadeUp 0.3s ease both',
                }}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', background: 'white', borderRadius: '4px 20px 20px 20px', padding: '16px 22px', display: 'flex', gap: 6, border: '1px solid rgba(201,146,42,0.15)' }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)', animation: `bounce 1.2s ease-in-out ${d}s infinite` }} />)}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {showSuggestions && messages.length === 0 && (
              <div style={{ padding: '0 28px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(lang === 'hi' ? q.hi : q.en)} style={{
                    background: '#FAF3E0', border: '1px solid rgba(201,146,42,0.25)', borderRadius: 8,
                    padding: '13px 18px', color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer',
                    textAlign: 'left', lineHeight: 1.5, fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s',
                  }}
                    onMouseOver={e => { (e.currentTarget as any).style.background = '#F5E6C4'; (e.currentTarget as any).style.borderColor = 'var(--saffron)' }}
                    onMouseOut={e => { (e.currentTarget as any).style.background = '#FAF3E0'; (e.currentTarget as any).style.borderColor = 'rgba(201,146,42,0.25)' }}>
                    <span style={{ color: 'var(--saffron)', marginRight: 8 }}>✦</span>
                    {lang === 'hi' ? q.hi : q.en}
                  </button>
                ))}
              </div>
            )}
            <div style={{ padding: '16px 28px 20px', borderTop: '1px solid rgba(201,146,42,0.1)', display: 'flex', gap: 12, alignItems: 'flex-end', background: 'white' }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
                placeholder={lang === 'hi' ? 'मित्र से कोई भी प्रश्न पूछें...' : 'Ask Mitra anything about dharma, life, Vedic wisdom...'}
                rows={1} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '1.05rem', resize: 'none', lineHeight: 1.6, fontFamily: 'var(--font-body)', maxHeight: 100, overflowY: 'auto' }}
                onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 100) + 'px' }} />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                width: 50, height: 50, borderRadius: '50%',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #F0C060, #D4560A)' : '#D4B896',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '1.3rem', flexShrink: 0, transition: 'all 0.2s',
                boxShadow: input.trim() ? '0 4px 20px rgba(212,86,10,0.4)' : 'none',
              }}>🪷</button>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: 20, fontStyle: 'italic' }}>Mitra shares Vedic knowledge for educational & spiritual guidance — not a substitute for professional advice</p>
        </div>
      )}

      {/* Other pages — Certify, Directory, Connect, Civic, Blog, Join */}
      {active !== 'home' && active !== 'ai' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
          {active === 'certify' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 56, animation: 'fadeUp 0.6s ease both' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', color: 'var(--dark)', marginBottom: 12 }}>Dharmic Business Certification</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Official recognition for Hindu, Sikh, Buddhist & Jain business owners in Canada</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0E0400, #1C0A00, #3D1500)', borderRadius: 12, padding: '60px 56px', color: '#FAF3E0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.06 }}><Mandala size={400} opacity={1} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, position: 'relative' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-dev)', color: '#F0C060', marginBottom: 12, fontSize: '1rem' }}>धर्मो रक्षति रक्षितः</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: 24, background: 'linear-gradient(135deg, #F0C060, #D4560A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>$100 CAD / Year</h2>
                    {['Official Dharmic Certification badge','Verified Business Directory listing','Downloadable PDF certificate','QR-scannable Member Card (1 year)','Priority placement in searches','Community trust verification'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: '0.95rem', color: '#EDD9A3', animation: `slideInLeft 0.4s ${i*0.08}s ease both` }}>
                        <span style={{ color: '#F0C060', flexShrink: 0 }}>✓</span> {item}
                      </div>
                    ))}
                    <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 24, padding: '16px 40px', background: 'linear-gradient(135deg, #F0C060, #D4560A)', color: '#1C0A00', borderRadius: 4, fontFamily: 'var(--font-display)', fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 8px 32px rgba(240,192,96,0.3)' }}>Apply Now — $100/yr 🪷</a>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#F0C060', marginBottom: 28, letterSpacing: '0.5px' }}>Revenue Split</div>
                    {[{ pct: '25%', label: 'Partner Organization', icon: '🛕' }, { pct: '25%', label: 'Dharmic Charity', icon: '🙏' }, { pct: '50%', label: 'Platform Operations', icon: '🪷' }].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, padding: '20px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(240,192,96,0.12)', animation: `slideInRight 0.4s ${i*0.1}s ease both`, transition: 'border-color 0.3s' }}
                        onMouseOver={e => (e.currentTarget as any).style.borderColor = 'rgba(240,192,96,0.5)'}
                        onMouseOut={e => (e.currentTarget as any).style.borderColor = 'rgba(240,192,96,0.12)'}>
                        <div style={{ fontSize: '1.8rem' }}>{item.icon}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', background: 'linear-gradient(135deg, #F0C060, #D4560A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', minWidth: 80 }}>{item.pct}</div>
                        <div style={{ fontSize: '0.95rem', color: '#EDD9A3' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {active === 'directory' && (
            <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--dark)', marginBottom: 16 }}>Dharmic Business Directory</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic', marginBottom: 48 }}>Verified Dharmic businesses across Canada</p>
              <div style={{ background: 'white', borderRadius: 12, padding: '72px', boxShadow: '0 4px 40px rgba(28,10,0,0.08)', border: '1px solid rgba(201,146,42,0.15)' }}>
                <div style={{ fontSize: '5rem', marginBottom: 24 }}>🏢</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--dark)', marginBottom: 14 }}>Launching Soon</h2>
                <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.8 }}>The directory launches with our first certified businesses. Get certified to be among the first listed.</p>
                <button onClick={() => setActive('certify')} style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Get Dharmic Certified →</button>
              </div>
            </div>
          )}
          {active === 'connect' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.6s ease both' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--dark)', marginBottom: 12 }}>Connect Board</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Find Dharmic members in your city · Free for verified members · Posts purge in 30 days</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 48 }}>
                {CONNECT_CATEGORIES.map((cat, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid rgba(201,146,42,0.18)', borderRadius: 10, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 2px 16px rgba(28,10,0,0.05)', animation: `fadeUp 0.4s ${i*0.05}s ease both` }}
                    onMouseOver={e => { (e.currentTarget as any).style.borderColor = 'var(--saffron)'; (e.currentTarget as any).style.transform = 'translateY(-6px)'; (e.currentTarget as any).style.boxShadow = '0 12px 32px rgba(28,10,0,0.12)' }}
                    onMouseOut={e => { (e.currentTarget as any).style.borderColor = 'rgba(201,146,42,0.18)'; (e.currentTarget as any).style.transform = 'translateY(0)'; (e.currentTarget as any).style.boxShadow = '0 2px 16px rgba(28,10,0,0.05)' }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{cat.icon}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{cat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: '56px', textAlign: 'center', boxShadow: '0 4px 40px rgba(28,10,0,0.08)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--dark)', marginBottom: 12 }}>Launching Soon</h2>
                <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.8 }}>Verified members will post city-based connection requests. Posts auto-purge after 30 days.</p>
                <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>Verify My Identity — $1 🪷</a>
              </div>
            </>
          )}
          {active === 'civic' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 56, animation: 'fadeUp 0.6s ease both' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--dark)', marginBottom: 12 }}>Civic Connect</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Dharmic voices in Canadian democracy — postal code sorted, non-partisan</p>
              </div>
              <div style={{ background: '#EBF4FF', border: '1px solid #BEE3F8', borderRadius: 8, padding: '16px 24px', marginBottom: 36, fontSize: '0.95rem', color: '#2C5282' }}>⚖️ <strong>Non-Partisan:</strong> Mitra Civic Connect welcomes all parties equally. Canadian Hindu Volunteers does not endorse any candidate or party.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                {[
                  { emoji: '🏛️', title: 'I Am a Candidate', desc: 'Reach verified Dharmic voters in your riding. Listed until election day. All parties welcome.', links: [{ label: 'Featured Listing — $200', href: ZEFFY_LINKS.featuredCandidate, bg: '#2C5282' }, { label: 'Riding-Wide Announcement — $100', href: ZEFFY_LINKS.ridingAnnouncement, bg: '#1A365D' }] },
                ].map((card, i) => (
                  <div key={i} style={{ background: 'white', border: '2px solid #2C5282', borderRadius: 12, padding: '40px 36px', animation: 'slideInLeft 0.5s ease both' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 18 }}>{card.emoji}</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--dark)', marginBottom: 14 }}>{card.title}</h2>
                    <p style={{ color: 'var(--text-sub)', marginBottom: 28, lineHeight: 1.75 }}>{card.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {card.links.map((link, j) => (
                        <a key={j} href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '13px 24px', background: link.bg, color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', textAlign: 'center', transition: 'opacity 0.2s' }}
                          onMouseOver={e => (e.currentTarget as any).style.opacity = '0.85'}
                          onMouseOut={e => (e.currentTarget as any).style.opacity = '1'}>{link.label} →</a>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ background: 'white', border: '2px solid #1A4A2E', borderRadius: 12, padding: '40px 36px', animation: 'slideInRight 0.5s ease both' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 18 }}>🙋</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--dark)', marginBottom: 14 }}>I Want to Volunteer</h2>
                  <p style={{ color: 'var(--text-sub)', marginBottom: 24, lineHeight: 1.75 }}>Find Dharmic candidates in your riding and offer your support.</p>
                  <div style={{ background: '#FAF3E0', borderRadius: 8, padding: '18px', marginBottom: 18 }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 10 }}>Enter your postal code to find candidates:</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input type="text" placeholder="e.g. L6Y 0A1" style={{ flex: 1, padding: '11px 16px', borderRadius: 4, border: '1px solid rgba(201,146,42,0.3)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
                      <button style={{ padding: '11px 22px', background: '#1A4A2E', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>Search</button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>
                    <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--saffron)' }}>Verify your membership</a> to be notified when candidates register.
                  </p>
                </div>
              </div>
            </>
          )}
          {active === 'blog' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 56, animation: 'fadeUp 0.6s ease both' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--dark)', marginBottom: 12 }}>Articles & Community News</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Stories, insights and wisdom from the Canadian Hindu community</p>
              </div>
              <div style={{ position: 'relative', background: `url(https://images.unsplash.com/photo-1566300141301-ab0577dcba1c?w=1400&q=80) center/cover`, borderRadius: 12, padding: '72px 56px', marginBottom: 48, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,4,0,0.78)', borderRadius: 12 }} />
                <div style={{ position: 'relative', color: '#FAF3E0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#F0C060', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 14 }}>📌 Featured · Announcements</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', marginBottom: 18, maxWidth: 700, lineHeight: 1.2 }}>Welcome to the New canadianhindu.ca — Mitra 2.0 is Here</h2>
                  <p style={{ color: 'rgba(250,243,224,0.82)', lineHeight: 1.8, maxWidth: 640, marginBottom: 28, fontSize: '1.05rem' }}>Canadian Hindu Volunteers is proud to launch Mitra 2.0 — Vedic AI, verified business directory, civic engagement, and community connection all in one place rooted in dharma.</p>
                  <div style={{ display: 'flex', gap: 24, fontSize: '0.85rem', color: 'rgba(240,192,96,0.75)' }}>
                    <span>✍️ Canadian Hindu Volunteers</span>
                    <span>·</span>
                    <span>📅 June 2025</span>
                    <span>·</span>
                    <span>3 min read</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginBottom: 48 }}>
                {[
                  { cat: 'Dharma', title: 'What is Dharmic Certification and Why It Matters', date: 'May 2025', time: '4 min', color: 'var(--saffron)' },
                  { cat: 'Civic', title: 'Dharmic Voices in Canadian Democracy', date: 'April 2025', time: '5 min', color: '#2C5282' },
                  { cat: 'Heritage', title: 'Preserving Vedic Traditions in Canada', date: 'March 2025', time: '6 min', color: '#C9922A' },
                  { cat: 'Youth', title: 'Hindu Identity and the Canadian-Born Generation', date: 'February 2025', time: '7 min', color: 'var(--maroon)' },
                  { cat: 'Community', title: 'Canadian Hindu Volunteers — Our Story', date: 'January 2025', time: '5 min', color: '#1A4A2E' },
                  { cat: 'AI & Tech', title: 'Mitra AI — 14 Vedic Scriptures, Available 24/7', date: 'December 2024', time: '3 min', color: '#5C2200' },
                ].map((article, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 20px rgba(28,10,0,0.07)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', animation: `fadeUp 0.4s ${i*0.07}s ease both`, borderTop: `4px solid ${article.color}` }}
                    onMouseOver={e => { (e.currentTarget as any).style.transform = 'translateY(-6px)'; (e.currentTarget as any).style.boxShadow = '0 16px 48px rgba(28,10,0,0.14)' }}
                    onMouseOut={e => { (e.currentTarget as any).style.transform = 'translateY(0)'; (e.currentTarget as any).style.boxShadow = '0 2px 20px rgba(28,10,0,0.07)' }}>
                    <div style={{ padding: '26px 24px' }}>
                      <div style={{ fontSize: '0.7rem', color: article.color, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>{article.cat}</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--dark)', marginBottom: 16, lineHeight: 1.4 }}>{article.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                        <span>📅 {article.date}</span>
                        <span>⏱ {article.time} read</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#FAF3E0', border: '1px solid rgba(201,146,42,0.25)', borderRadius: 12, padding: '48px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark)', marginBottom: 12 }}>Share Your Story</h3>
                <p style={{ color: 'var(--text-sub)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.8 }}>We welcome articles from community members on dharma, heritage, civic life, and Hindu life in Canada.</p>
                <a href="mailto:canadianhinduvolunteers@gmail.com?subject=Article Submission" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--saffron)', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Submit an Article →</a>
              </div>
            </>
          )}
          {active === 'join' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 56, animation: 'fadeUp 0.6s ease both' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: 'var(--dark)', marginBottom: 12 }}>Join the Community</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Verified membership for the Dharmic community across Canada</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                <div style={{ background: 'white', border: '2px solid rgba(201,146,42,0.25)', borderRadius: 12, padding: '48px 44px', textAlign: 'center', boxShadow: '0 4px 32px rgba(28,10,0,0.08)', animation: 'slideInLeft 0.5s ease both', transition: 'transform 0.3s, box-shadow 0.3s' }}
                  onMouseOver={e => { (e.currentTarget as any).style.transform = 'translateY(-8px)'; (e.currentTarget as any).style.boxShadow = '0 20px 60px rgba(28,10,0,0.14)' }}
                  onMouseOut={e => { (e.currentTarget as any).style.transform = 'translateY(0)'; (e.currentTarget as any).style.boxShadow = '0 4px 32px rgba(28,10,0,0.08)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 18 }}>🪪</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark)', marginBottom: 8 }}>Verified Member</h2>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', background: 'linear-gradient(135deg, #D4560A, #C9922A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4, lineHeight: 1 }}>$1</div>
                  <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: 32 }}>One-time · Valid 1 year · Must be 16+</div>
                  <div style={{ textAlign: 'left', marginBottom: 36 }}>
                    {['Identity-verified Member Card','Post on the Connect Board','Connect with members in your city','Access Civic Connect in your riding','Chat with Mitra AI (save history)'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: '0.95rem', color: 'var(--text-sub)' }}>
                        <span style={{ color: 'var(--saffron)', flexShrink: 0 }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                  <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '16px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '1.05rem', boxShadow: '0 6px 24px rgba(212,86,10,0.35)' }}>Verify My Identity — $1 🪷</a>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #0E0400, #1C0A00, #3D1500)', border: '2px solid rgba(240,192,96,0.25)', borderRadius: 12, padding: '48px 44px', textAlign: 'center', color: '#FAF3E0', animation: 'slideInRight 0.5s ease both', transition: 'transform 0.3s', position: 'relative', overflow: 'hidden' }}
                  onMouseOver={e => (e.currentTarget as any).style.transform = 'translateY(-8px)'}
                  onMouseOut={e => (e.currentTarget as any).style.transform = 'translateY(0)'}>
                  <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.06 }}><Mandala size={200} opacity={1} /></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 18 }}>🏅</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8 }}>Dharmic Certified Business</h2>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', background: 'linear-gradient(135deg, #F0C060, #D4560A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4, lineHeight: 1 }}>$100</div>
                    <div style={{ color: 'rgba(240,192,96,0.6)', fontSize: '0.88rem', marginBottom: 32 }}>Annual · Renews yearly</div>
                    <div style={{ textAlign: 'left', marginBottom: 36 }}>
                      {['Everything in Member Card','Official Dharmic certification badge','Business Directory listing','Downloadable PDF certificate','25% to your referring org','25% to a Dharmic charity'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: '0.95rem', color: 'rgba(250,243,224,0.8)' }}>
                          <span style={{ color: '#F0C060', flexShrink: 0 }}>✓</span> {item}
                        </div>
                      ))}
                    </div>
                    <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '16px', background: 'linear-gradient(135deg, #F0C060, #D4560A)', color: '#1C0A00', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '1.05rem', boxShadow: '0 6px 24px rgba(240,192,96,0.3)' }}>Get Certified — $100/yr 🏅</a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        textarea::placeholder { color: var(--text-sub); opacity: 0.55; }
        input::placeholder { color: var(--text-sub); opacity: 0.55; }
        @keyframes floatOM { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.05)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(240,192,96,0.35)} 50%{box-shadow:0 0 48px rgba(240,192,96,0.75),0 0 90px rgba(212,86,10,0.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes rotateMandala { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes rotateMandalaRev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes kenBurns { 0%{transform:scale(1)} 100%{transform:scale(1.08)} }
        @keyframes particleFloat { 0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0} 10%{opacity:0.8} 90%{opacity:0.8} 100%{transform:translateY(-120vh) translateX(30px) rotate(720deg);opacity:0} }
        @keyframes shimmerGold { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(48px)} to{opacity:1;transform:translateX(0)} }
        @keyframes borderDance { 0%,100%{border-color:rgba(240,192,96,0.4)} 50%{border-color:rgba(240,192,96,0.9)} }
        @keyframes countUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

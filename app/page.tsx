'use client'
import { useState, useRef, useEffect } from 'react'
import { ZEFFY_LINKS, CONNECT_CATEGORIES } from '@/lib/constants'

const NAV_ITEMS = [
  { icon: '🤖', label: 'Mitra AI', id: 'ai' },
  { icon: '🏢', label: 'Directory', id: 'directory' },
  { icon: '🏅', label: 'Certify', id: 'certify' },
  { icon: '📋', label: 'Connect', id: 'connect' },
  { icon: '🗳️', label: 'Civic', id: 'civic' },
  { icon: '📰', label: 'Articles', id: 'blog' },
  { icon: '🪪', label: 'Join', id: 'join' },
]

const TEMPLE_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Akshardham_temple_at_night.jpg/1280px-Akshardham_temple_at_night.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kedarnath_Temple.jpg/1280px-Kedarnath_Temple.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Golden_Temple_reflection.jpg/1280px-Golden_Temple_reflection.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Brihadeeswarar_Temple_Thanjavur.jpg/1280px-Brihadeeswarar_Temple_Thanjavur.jpg',
]

const HERITAGE_IMAGES = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nataraja_at_CSMVS.jpg/800px-Nataraja_at_CSMVS.jpg', caption: 'Nataraja — The Cosmic Dance' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Diya_-_oil_lamp.jpg/800px-Diya_-_oil_lamp.jpg', caption: 'Deepam — Light of Knowledge' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Lotus_flower_%28978659).jpg/800px-Lotus_flower_%28978659%29.jpg', caption: 'Lotus — Symbol of Purity' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg/800px-Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg', caption: 'Ganesha — Remover of Obstacles' },
]

const SUGGESTED = [
  { en: "Why do we light a diya? What does it mean spiritually?", hi: "हम दीया क्यों जलाते हैं? इसका आध्यात्मिक अर्थ क्या है?" },
  { en: "My friend says Hindus worship idols. How do I explain?", hi: "मेरे दोस्त ने कहा हिन्दू मूर्तिपूजक हैं — क्या जवाब दूं?" },
  { en: "What does the Bhagavad Gita say about dealing with stress?", hi: "तनाव से निपटने के बारे में गीता क्या कहती है?" },
  { en: "What is the soul? Where do we go after death?", hi: "आत्मा क्या है? मृत्यु के बाद हम कहाँ जाते हैं?" },
  { en: "How can I live a truly dharmic life today?", hi: "आज धर्मपूर्ण जीवन कैसे जिएं?" },
  { en: "Why is Hanuman not a monkey? The real story.", hi: "हनुमान जी बन्दर नहीं थे — असली कहानी क्या है?" },
]

const formatMessage = (text: string) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const formatted = parts.map((p, j) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={j}>{p.slice(2, -2)}</strong>
        : p
    )
    return <p key={i} style={{ margin: '4px 0', lineHeight: 1.8 }}>{formatted}</p>
  })
}

export default function Home() {
  const [active, setActive] = useState('home')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [heroImg, setHeroImg] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const interval = setInterval(() => setHeroImg(i => (i + 1) % TEMPLE_IMAGES.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    setShowSuggestions(false)
    const newHistory = [...messages, { role: 'user', content: userText }]
    setMessages(newHistory)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      })
      const data = await res.json()
      setMessages([...newHistory, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...newHistory, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>

      {/* HEADER */}
      <header style={{
        background: 'linear-gradient(135deg, #1C0A00 0%, #3D1500 60%, #1C0A00 100%)',
        position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 4px 30px rgba(28,10,0,0.5)',
        borderBottom: '2px solid rgba(201,146,42,0.4)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          
          {/* Logo */}
          <div onClick={() => setActive('home')} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F0C060, #D4560A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontFamily: 'var(--font-dev)',
              boxShadow: '0 0 20px rgba(240,192,96,0.4)',
            }}>ॐ</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#FAF3E0', letterSpacing: '0.5px', lineHeight: 1.1 }}>Mitra · मित्र</div>
              <div style={{ fontSize: '0.62rem', color: '#C9922A', letterSpacing: '2px', textTransform: 'uppercase' }}>Canadian Hindu Community</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setActive(item.id)} style={{
                padding: '8px 16px', borderRadius: 4, border: 'none', cursor: 'pointer',
                background: active === item.id ? 'rgba(212,86,10,0.8)' : 'transparent',
                color: active === item.id ? '#FAF3E0' : '#C9A060',
                fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: active === item.id ? 600 : 400,
                transition: 'all 0.2s', letterSpacing: '0.3px',
              }}>
                {item.label}
              </button>
            ))}
            <div style={{ width: 1, height: 24, background: 'rgba(201,146,42,0.3)', margin: '0 8px' }} />
            {(['en', 'hi'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
                background: lang === l ? 'rgba(240,192,96,0.2)' : 'transparent',
                color: lang === l ? '#F0C060' : '#8B6030',
                fontSize: '0.78rem', fontWeight: 'bold',
              }}>{l === 'en' ? 'EN' : 'हि'}</button>
            ))}
          </nav>
        </div>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #F0C060 30%, #D4560A 50%, #F0C060 70%, transparent)' }} />
      </header>

      {/* HOME PAGE */}
      {active === 'home' && (
        <>
          {/* HERO — full bleed temple image */}
          <div style={{ position: 'relative', height: '92vh', overflow: 'hidden' }}>
            {TEMPLE_IMAGES.map((img, i) => (
              <div key={i} style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: heroImg === i ? 1 : 0,
                transition: 'opacity 1.5s ease',
              }} />
            ))}
            {/* Dark overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(28,10,0,0.3) 0%, rgba(28,10,0,0.6) 50%, rgba(28,10,0,0.85) 100%)',
            }} />
            {/* Hero content */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 24px',
              animation: 'fadeUp 1s ease forwards',
            }}>
              <div style={{
                fontFamily: 'var(--font-dev)', fontSize: '5.5rem', color: '#F0C060',
                textShadow: '0 0 40px rgba(240,192,96,0.6)', marginBottom: 8,
                animation: 'float 4s ease-in-out infinite',
              }}>ॐ</div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                color: '#FAF3E0', lineHeight: 1.1, marginBottom: 20,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}>
                {lang === 'hi' ? 'मित्र में आपका स्वागत है' : 'Welcome to Mitra'}
              </h1>
              <p style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                color: 'rgba(250,243,224,0.9)', maxWidth: 700,
                fontFamily: 'var(--font-body)', fontStyle: 'italic',
                marginBottom: 32, lineHeight: 1.7,
                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }}>
                {lang === 'hi'
                  ? 'कनाडा में हिन्दू, सिख, बौद्ध और जैन समुदाय का एकमात्र विश्वसनीय मंच'
                  : "Canada's trusted home for the Hindu, Sikh, Buddhist & Jain community — connect, certify, and thrive together"}
              </p>
              <div style={{
                fontFamily: 'var(--font-dev)', fontSize: '1.1rem',
                color: '#F0C060', letterSpacing: '1px',
                background: 'rgba(28,10,0,0.5)', padding: '10px 28px', borderRadius: 40,
                border: '1px solid rgba(240,192,96,0.3)',
                backdropFilter: 'blur(8px)',
              }}>
                धर्मो रक्षति रक्षितः — Dharma Protected, Protects
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => setActive('ai')} style={{
                  padding: '16px 36px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)',
                  color: '#FAF3E0', border: 'none', borderRadius: 4, cursor: 'pointer',
                  fontSize: '1.05rem', fontFamily: 'var(--font-display)',
                  boxShadow: '0 6px 24px rgba(212,86,10,0.5)',
                  transition: 'transform 0.2s',
                }}>Ask Mitra AI →</button>
                <button onClick={() => setActive('join')} style={{
                  padding: '16px 36px', background: 'transparent',
                  color: '#F0C060', border: '2px solid rgba(240,192,96,0.6)', borderRadius: 4, cursor: 'pointer',
                  fontSize: '1.05rem', fontFamily: 'var(--font-display)',
                  backdropFilter: 'blur(8px)',
                }}>Join for $1 CAD</button>
              </div>
            </div>
            {/* Scroll indicator */}
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'rgba(240,192,96,0.7)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              scroll to explore ↓
            </div>
          </div>

          {/* STATS BAR */}
          <div style={{ background: 'linear-gradient(135deg, #1C0A00, #3D1500)', padding: '40px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
              {[
                { num: '659', label: 'Community Members', sub: 'across Canada' },
                { num: '$1', label: 'To Join', sub: 'identity verified' },
                { num: '25%', label: 'To Partner Orgs', sub: 'per certification' },
                { num: '14', label: 'Vedic Scriptures', sub: 'powering Mitra AI' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '24px 16px', borderRight: i < 3 ? '1px solid rgba(201,146,42,0.2)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#F0C060', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ color: '#FAF3E0', fontSize: '0.95rem', fontWeight: 600, marginTop: 6 }}>{s.label}</div>
                  <div style={{ color: 'rgba(201,146,42,0.8)', fontSize: '0.8rem' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HERITAGE IMAGE STRIP */}
          <div style={{ padding: '80px 24px 60px', background: 'var(--cream)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1.3rem', color: 'var(--saffron)', marginBottom: 8 }}>सनातन धर्म</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--dark)', lineHeight: 1.2 }}>
                  Ancient Wisdom.<br />Modern Community.
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {HERITAGE_IMAGES.map((img, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '3/4' }}>
                    <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(28,10,0,0.85))',
                      padding: '32px 16px 16px',
                      color: '#F0C060', fontSize: '0.85rem', fontStyle: 'italic',
                      fontFamily: 'var(--font-body)',
                    }}>{img.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURES GRID */}
          <div style={{ background: '#F5E6C4', padding: '80px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: 'var(--dark)' }}>
                  Everything Your Community Needs
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {[
                  { icon: '🤖', title: 'Mitra AI', color: '#D4560A', id: 'ai', desc: 'Ask anything about dharma, Vedic wisdom, Hindu identity, and daily spiritual guidance. Powered by 14 ancient scriptures.', btn: 'Ask Mitra' },
                  { icon: '🏅', title: 'Dharmic Certification', color: '#C9922A', id: 'certify', desc: 'Official certification for Hindu, Sikh, Buddhist & Jain businesses. 50% supports partner orgs and Dharmic charities.', btn: 'Get Certified — $100/yr' },
                  { icon: '🏢', title: 'Business Directory', color: '#7B1616', id: 'directory', desc: 'Find verified Dharmic businesses across Canada. Every listing is identity-verified and community-trusted.', btn: 'Browse Directory' },
                  { icon: '📋', title: 'Connect Board', color: '#1A4A2E', id: 'connect', desc: 'Find community members in your city for sports, arts, study groups, seva and more. Free for verified members.', btn: 'Connect Now' },
                  { icon: '🗳️', title: 'Civic Connect', color: '#2C4A82', id: 'civic', desc: 'Connect with Dharmic candidates and volunteers in your riding. Sorted by postal code. Non-partisan.', btn: 'Explore Civic' },
                  { icon: '🪪', title: 'Member Card', color: '#5C2200', id: 'join', desc: 'Get your verified Dharmic Member Card for just $1 CAD. Identity-verified, QR-scannable, valid for 1 year.', btn: 'Join for $1' },
                ].map(f => (
                  <div key={f.id} style={{
                    background: 'white', borderRadius: 8,
                    borderTop: `4px solid ${f.color}`,
                    padding: '32px 28px',
                    boxShadow: '0 2px 20px rgba(28,10,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(28,10,0,0.15)' }}
                    onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 20px rgba(28,10,0,0.08)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--dark)', marginBottom: 10 }}>{f.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
                    <button onClick={() => setActive(f.id)} style={{
                      background: f.color, color: 'white', border: 'none',
                      padding: '10px 20px', borderRadius: 4, cursor: 'pointer',
                      fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 600,
                    }}>{f.btn} →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DHARMIC SPLIT SECTION */}
          <div style={{
            background: `linear-gradient(rgba(28,10,0,0.88), rgba(28,10,0,0.92)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Puja_offerings.jpg/1280px-Puja_offerings.jpg) center/cover`,
            padding: '100px 24px', textAlign: 'center', color: '#FAF3E0',
          }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1.2rem', color: '#F0C060', marginBottom: 12 }}>धर्मो रक्षति रक्षितः</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: 16, lineHeight: 1.2 }}>
                Every $100 Certification<br />Gives Back to the Community
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(250,243,224,0.8)', marginBottom: 56, fontStyle: 'italic' }}>
                Dharma in business means giving back — every certification directly supports community organizations and charities
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {[
                  { pct: '25%', label: 'Partner Organization', sub: 'Temple, sabha, or referring org', icon: '🛕' },
                  { pct: '25%', label: 'Dharmic Charity', sub: 'Selected quarterly with partners', icon: '🙏' },
                  { pct: '50%', label: 'Platform & Programs', sub: 'Keeping Mitra free & growing', icon: '🪷' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(240,192,96,0.25)',
                    borderRadius: 8, padding: '36px 24px',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#F0C060', lineHeight: 1 }}>{item.pct}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, margin: '10px 0 4px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(240,192,96,0.7)' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', marginTop: 48,
                padding: '18px 48px', background: 'linear-gradient(135deg, #F0C060, #D4560A)',
                color: '#1C0A00', borderRadius: 4, fontFamily: 'var(--font-display)',
                fontSize: '1.1rem', textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(240,192,96,0.3)',
              }}>Apply for Dharmic Certification — $100/yr 🪷</a>
            </div>
          </div>

          {/* FOOTER */}
          <footer style={{ background: '#1C0A00', color: '#C9A060', padding: '48px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FAF3E0', marginBottom: 8 }}>Mitra · मित्र</div>
                <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1rem', color: '#F0C060', marginBottom: 12 }}>धर्मो रक्षति रक्षितः</div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(201,160,96,0.7)', lineHeight: 1.7 }}>
                  A Canadian Hindu Volunteers initiative serving the Hindu, Sikh, Buddhist & Jain community across Canada.
                </p>
                <div style={{ marginTop: 16, fontSize: '0.82rem', color: 'rgba(201,160,96,0.5)' }}>canadianhinduvolunteers@gmail.com</div>
              </div>
              {[
                { title: 'Platform', links: ['Mitra AI', 'Directory', 'Certify', 'Connect Board'] },
                { title: 'Community', links: ['Civic Connect', 'Articles', 'Join for $1', 'Dharmic Certification'] },
                { title: 'Organization', links: ['canadianhindu.ca', 'About Us', 'Partner With Us', 'Contact'] },
              ].map((col, i) => (
                <div key={i}>
                  <div style={{ color: '#FAF3E0', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
                  {col.links.map(link => (
                    <div key={link} style={{ color: 'rgba(201,160,96,0.6)', fontSize: '0.88rem', marginBottom: 8, cursor: 'pointer' }}
                      onMouseOver={e => (e.currentTarget.style.color = '#F0C060')}
                      onMouseOut={e => (e.currentTarget.style.color = 'rgba(201,160,96,0.6)')}>{link}</div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(201,160,96,0.15)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(201,160,96,0.4)' }}>
              <div>© 2025 Canadian Hindu Volunteers. All rights reserved.</div>
              <div>For educational & spiritual guidance only · Not a substitute for professional advice</div>
            </div>
          </footer>
        </>
      )}

      {/* MITRA AI PAGE */}
      {active === 'ai' && (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-dev)', fontSize: '3rem', color: 'var(--saffron)', marginBottom: 8 }}>ॐ</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--dark)', marginBottom: 12 }}>Mitra — Your Vedic Guide</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Ask anything about dharma, spirituality, Hindu identity, and daily life</p>
          </div>

          <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 40px rgba(28,10,0,0.12)', border: '1px solid rgba(201,146,42,0.2)' }}>
            {/* Chat header */}
            <div style={{ background: 'linear-gradient(135deg, #1C0A00, #3D1500)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F0C060, #D4560A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontFamily: 'var(--font-dev)' }}>ॐ</div>
                <div>
                  <div style={{ color: '#FAF3E0', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Mitra · मित्र</div>
                  <div style={{ color: '#F0C060', fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Vedic AI · 14 Scriptures · Groq Powered</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['en', 'hi'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    background: lang === l ? 'rgba(240,192,96,0.9)' : 'rgba(255,255,255,0.1)',
                    color: lang === l ? '#1C0A00' : '#F0C060', fontSize: '0.78rem', fontWeight: 'bold',
                  }}>{l === 'en' ? 'EN' : 'हि'}</button>
                ))}
                {messages.length > 0 && (
                  <button onClick={() => { setMessages([]); setShowSuggestions(true) }} style={{
                    padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(240,192,96,0.3)',
                    background: 'transparent', color: '#C9A060', fontSize: '0.75rem', cursor: 'pointer',
                  }}>New Chat</button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div style={{ height: 480, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, background: '#FFFDF6' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-sub)' }}>
                  <div style={{ fontSize: '4rem', fontFamily: 'var(--font-dev)', color: 'var(--saffron)', marginBottom: 12 }}>ॐ</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--dark)', marginBottom: 8 }}>
                    {lang === 'hi' ? 'मित्र से कोई भी प्रश्न पूछें' : 'Ask Mitra anything'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>Vedic wisdom for every question, every age, every moment</div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #8B2E00, #D4560A)' : 'white',
                  color: msg.role === 'user' ? '#FAF3E0' : 'var(--text)',
                  borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                  padding: '16px 20px', fontSize: '1rem', lineHeight: 1.7,
                  border: msg.role === 'assistant' ? '1px solid rgba(201,146,42,0.2)' : 'none',
                  boxShadow: '0 2px 12px rgba(28,10,0,0.08)',
                }}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              ))}
              {loading && (
                <div style={{
                  alignSelf: 'flex-start', background: 'white', borderRadius: '4px 20px 20px 20px',
                  padding: '16px 20px', display: 'flex', gap: 6, border: '1px solid rgba(201,146,42,0.2)',
                }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)', animation: `bounce 1.2s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && messages.length === 0 && (
              <div style={{ padding: '0 24px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(lang === 'hi' ? q.hi : q.en)} style={{
                    background: '#FAF3E0', border: '1px solid rgba(201,146,42,0.3)',
                    borderRadius: 8, padding: '12px 16px', color: 'var(--text)',
                    fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left', lineHeight: 1.5,
                    fontFamily: lang === 'hi' ? 'var(--font-dev)' : 'var(--font-body)',
                    transition: 'all 0.15s',
                  }}
                    onMouseOver={e => { (e.currentTarget).style.background = '#F5E6C4'; (e.currentTarget).style.borderColor = 'var(--saffron)' }}
                    onMouseOut={e => { (e.currentTarget).style.background = '#FAF3E0'; (e.currentTarget).style.borderColor = 'rgba(201,146,42,0.3)' }}>
                    <span style={{ color: 'var(--saffron)', marginRight: 6 }}>✦</span>
                    {lang === 'hi' ? q.hi : q.en}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(201,146,42,0.15)', display: 'flex', gap: 12, alignItems: 'flex-end', background: 'white' }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={lang === 'hi' ? 'मित्र से कोई भी प्रश्न पूछें...' : 'Ask Mitra anything about dharma, life, Vedic wisdom...'}
                rows={1} style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text)', fontSize: '1rem', resize: 'none',
                  lineHeight: 1.6, fontFamily: 'var(--font-body)', maxHeight: 100, overflowY: 'auto',
                }}
                onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 100) + 'px' }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                width: 48, height: 48, borderRadius: '50%',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #F0C060, #D4560A)' : '#D4B896',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '1.2rem', flexShrink: 0,
                boxShadow: input.trim() ? '0 4px 16px rgba(212,86,10,0.4)' : 'none',
              }}>🪷</button>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: 20, fontStyle: 'italic' }}>
            Mitra shares Vedic knowledge for educational & spiritual guidance — not a substitute for professional advice
          </p>
        </div>
      )}

      {/* CERTIFY PAGE */}
      {active === 'certify' && (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--dark)', marginBottom: 12 }}>Dharmic Business Certification</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>Official recognition for Hindu, Sikh, Buddhist & Jain business owners in Canada</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #1C0A00, #3D1500)', borderRadius: 16, padding: '56px 48px', color: '#FAF3E0', marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-dev)', fontSize: '1rem', color: '#F0C060', marginBottom: 12 }}>धर्मो रक्षति रक्षितः</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 20, lineHeight: 1.2 }}>$100 CAD / Year</h2>
                <div style={{ marginBottom: 28 }}>
                  {['Official Dharmic Certification badge', 'Verified Business Directory listing', 'Downloadable PDF certificate', 'QR-scannable Member Card (1 year)', 'Priority placement in searches', 'Community trust verification'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: '0.95rem', color: '#EDD9A3' }}>
                      <span style={{ color: '#F0C060', flexShrink: 0 }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', padding: '16px 36px',
                  background: 'linear-gradient(135deg, #F0C060, #D4560A)',
                  color: '#1C0A00', borderRadius: 4, fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem', textDecoration: 'none',
                }}>Apply Now — $100/yr 🪷</a>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F0C060', marginBottom: 24 }}>Revenue Split</div>
                {[{ pct: '25%', label: 'Partner Organization', icon: '🛕' }, { pct: '25%', label: 'Dharmic Charity', icon: '🙏' }, { pct: '50%', label: 'Platform Operations', icon: '🪷' }].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(240,192,96,0.15)' }}>
                    <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#F0C060', minWidth: 70 }}>{item.pct}</div>
                    <div style={{ fontSize: '0.95rem', color: '#EDD9A3' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CIVIC PAGE */}
      {active === 'civic' && (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--dark)', marginBottom: 12 }}>Civic Connect</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Dharmic voices in Canadian democracy — sorted by postal code</p>
          </div>
          <div style={{ background: '#EBF4FF', border: '1px solid #BEE3F8', borderRadius: 8, padding: '16px 24px', marginBottom: 32, fontSize: '0.95rem', color: '#2C5282' }}>
            ⚖️ <strong>Non-Partisan:</strong> Mitra Civic Connect welcomes candidates of all parties equally. Canadian Hindu Volunteers does not endorse any candidate or party.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'white', border: '2px solid #2C5282', borderRadius: 12, padding: '36px 32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🏛️</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--dark)', marginBottom: 12 }}>I Am a Candidate</h2>
              <p style={{ color: 'var(--text-sub)', marginBottom: 24, lineHeight: 1.7 }}>Reach verified Dharmic voters in your riding. Listed until election day. Completely non-partisan.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href={ZEFFY_LINKS.featuredCandidate} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px 24px', background: '#2C5282', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Featured Listing — $50 →</a>
                <a href={ZEFFY_LINKS.ridingAnnouncement} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px 24px', background: '#1A365D', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Riding-Wide Announcement — $100 →</a>
              </div>
            </div>
            <div style={{ background: 'white', border: '2px solid var(--forest)', borderRadius: 12, padding: '36px 32px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🙋</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--dark)', marginBottom: 12 }}>I Want to Volunteer</h2>
              <p style={{ color: 'var(--text-sub)', marginBottom: 24, lineHeight: 1.7 }}>Find Dharmic candidates in your riding by postal code and support their campaign.</p>
              <div style={{ background: '#FAF3E0', borderRadius: 8, padding: '16px', marginBottom: 16 }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 10 }}>Enter your postal code:</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="text" placeholder="e.g. L6Y 0A1" style={{ flex: 1, padding: '10px 14px', borderRadius: 4, border: '1px solid rgba(201,146,42,0.3)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
                  <button style={{ padding: '10px 20px', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.9rem' }}>Search</button>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>
                <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--saffron)' }}>Verify your membership</a> to be notified when candidates register in your riding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* JOIN PAGE */}
      {active === 'join' && (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--dark)', marginBottom: 12 }}>Join the Community</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Verified membership for the Dharmic community across Canada</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'white', border: '2px solid rgba(201,146,42,0.3)', borderRadius: 12, padding: '40px 36px', textAlign: 'center', boxShadow: '0 4px 24px rgba(28,10,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🪪</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--dark)', marginBottom: 8 }}>Verified Member</h2>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--saffron)', marginBottom: 4 }}>$1</div>
              <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: 24 }}>One-time · Valid 1 year · 16+</div>
              <div style={{ textAlign: 'left', marginBottom: 28 }}>
                {['Identity-verified Member Card', 'Post on the Connect Board', 'Connect with members in your city', 'Access Civic Connect in your riding', 'Chat with Mitra AI'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '0.92rem', color: 'var(--text-sub)' }}>
                    <span style={{ color: 'var(--saffron)' }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Verify My Identity — $1 🪷</a>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1C0A00, #3D1500)', border: '2px solid rgba(240,192,96,0.3)', borderRadius: 12, padding: '40px 36px', textAlign: 'center', color: '#FAF3E0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏅</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 8 }}>Dharmic Certified Business</h2>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#F0C060', marginBottom: 4 }}>$100</div>
              <div style={{ color: 'rgba(240,192,96,0.7)', fontSize: '0.88rem', marginBottom: 24 }}>Annual · Renews yearly</div>
              <div style={{ textAlign: 'left', marginBottom: 28 }}>
                {['Everything in Member Card', 'Official Dharmic badge', 'Business Directory listing', 'Downloadable PDF certificate', '25% to your referring org', '25% to a Dharmic charity'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '0.92rem', color: 'rgba(250,243,224,0.8)' }}>
                    <span style={{ color: '#F0C060' }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #F0C060, #D4560A)', color: '#1C0A00', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Get Certified — $100/yr 🏅</a>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTORY PAGE */}
      {active === 'directory' && (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--dark)', marginBottom: 16 }}>Dharmic Business Directory</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic', marginBottom: 40 }}>Verified Hindu, Sikh, Buddhist & Jain businesses across Canada</p>
          <div style={{ background: 'white', borderRadius: 12, padding: '56px', boxShadow: '0 4px 24px rgba(28,10,0,0.08)', border: '1px solid rgba(201,146,42,0.2)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🏢</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark)', marginBottom: 12 }}>Launching Soon</h2>
            <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8 }}>The directory launches with our first certified businesses. Get certified to be among the first listed.</p>
            <button onClick={() => setActive('certify')} style={{ padding: '14px 36px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Get Dharmic Certified →</button>
          </div>
        </div>
      )}

      {/* CONNECT BOARD */}
      {active === 'connect' && (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--dark)', marginBottom: 12 }}>Connect Board</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Find Dharmic community members in your city · Free for verified members · Posts purge in 30 days</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 40 }}>
            {CONNECT_CATEGORIES.map((cat, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid rgba(201,146,42,0.2)', borderRadius: 10, padding: '20px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(28,10,0,0.05)' }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--saffron)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,146,42,0.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{cat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: 12, padding: '48px', textAlign: 'center', boxShadow: '0 4px 24px rgba(28,10,0,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark)', marginBottom: 12 }}>Launching Soon</h2>
            <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.8 }}>Verified members will post and browse city-based connection requests. Posts are free and auto-purge after 30 days.</p>
            <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>Verify My Identity — $1 🪷</a>
          </div>
        </div>
      )}

      {/* BLOG PAGE */}
      {active === 'blog' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--dark)', marginBottom: 12 }}>Articles & Community News</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-sub)', fontStyle: 'italic' }}>Stories, insights and wisdom from the Canadian Hindu community</p>
          </div>

          {/* Featured */}
          <div style={{
            background: `linear-gradient(rgba(28,10,0,0.75), rgba(28,10,0,0.85)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kedarnath_Temple.jpg/1280px-Kedarnath_Temple.jpg) center/cover`,
            borderRadius: 12, padding: '56px 48px', color: '#FAF3E0', marginBottom: 40,
          }}>
            <div style={{ fontSize: '0.75rem', color: '#F0C060', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>📌 Featured · Announcements</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', marginBottom: 16, maxWidth: 680, lineHeight: 1.2 }}>Welcome to the New canadianhindu.ca — Mitra 2.0 is Here</h2>
            <p style={{ color: 'rgba(250,243,224,0.85)', lineHeight: 1.8, maxWidth: 620, marginBottom: 24, fontSize: '1.05rem' }}>
              Canadian Hindu Volunteers is proud to launch Mitra 2.0 — a complete community platform for Hindus, Sikhs, Buddhists and Jains across Canada. Vedic AI, verified directory, civic engagement, and community connection — all in one place.
            </p>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: 'rgba(240,192,96,0.8)' }}>
              <span>✍️ Canadian Hindu Volunteers</span>
              <span>·</span>
              <span>📅 June 2025</span>
              <span>·</span>
              <span>3 min read</span>
            </div>
          </div>

          {/* Article grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 48 }}>
            {[
              { cat: 'Dharma & Spirituality', title: 'What is Dharmic Certification and Why It Matters for Canadian Businesses', date: 'May 2025', time: '4 min' },
              { cat: 'Civic', title: 'Dharmic Voices in Canadian Democracy — Making Our Vote Count', date: 'April 2025', time: '5 min' },
              { cat: 'Heritage & Culture', title: 'Preserving Vedic Traditions While Raising Children in Canada', date: 'March 2025', time: '6 min' },
              { cat: 'Youth', title: 'Hindu Identity and the Canadian-Born Generation', date: 'February 2025', time: '7 min' },
              { cat: 'Community', title: 'Canadian Hindu Volunteers — Our Story and Mission', date: 'January 2025', time: '5 min' },
              { cat: 'Dharma & Spirituality', title: 'Mitra AI — 14 Vedic Scriptures Available 24/7 in English & Hindi', date: 'December 2024', time: '3 min' },
            ].map((article, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 10, overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(28,10,0,0.07)', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid rgba(201,146,42,0.1)',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(28,10,0,0.12)' }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(28,10,0,0.07)' }}>
                <div style={{ height: 6, background: i % 3 === 0 ? 'var(--saffron)' : i % 3 === 1 ? 'var(--gold)' : 'var(--maroon)' }} />
                <div style={{ padding: '24px 22px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--saffron)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>{article.cat}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--dark)', marginBottom: 14, lineHeight: 1.4 }}>{article.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                    <span>📅 {article.date}</span>
                    <span>⏱ {article.time} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#FAF3E0', border: '1px solid rgba(201,146,42,0.3)', borderRadius: 12, padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--dark)', marginBottom: 10 }}>Share Your Story</h3>
            <p style={{ color: 'var(--text-sub)', maxWidth: 440, margin: '0 auto 20px' }}>We welcome articles from community members on dharma, heritage, civic life, and Hindu life in Canada.</p>
            <a href="mailto:canadianhinduvolunteers@gmail.com?subject=Article Submission" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--saffron)', color: 'white', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>Submit an Article →</a>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        textarea::placeholder { color: var(--text-sub); opacity: 0.6; }
        input::placeholder { color: var(--text-sub); opacity: 0.6; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }
      `}</style>
    </div>
  )
}

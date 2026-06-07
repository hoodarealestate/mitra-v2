'use client'
import { useState, useRef, useEffect } from 'react'
import { ZEFFY_LINKS, CONNECT_CATEGORIES } from '@/lib/constants'

const OM = 'ॐ'

const NAV_ITEMS = [
  { icon: '🤖', label: 'Mitra AI', id: 'ai' },
  { icon: '🏢', label: 'Directory', id: 'directory' },
  { icon: '🏅', label: 'Certify', id: 'certify' },
  { icon: '📋', label: 'Connect Board', id: 'connect' },
  { icon: '🗳️', label: 'Civic', id: 'civic' },
  { icon: '🪪', label: 'Join', id: 'join' },
  { icon: '📰', label: 'Articles', id: 'blog' },
]

const SUGGESTED = [
  { en: "I'm a child — why do we do puja and light diyas?", hi: "हम घर पर पूजा और दीया क्यों करते हैं?" },
  { en: "My friend says Hindus worship idols — how do I explain?", hi: "मेरे दोस्त ने कहा हिन्दू मूर्तिपूजक हैं — क्या जवाब दूं?" },
  { en: "What does the Bhagavad Gita say about dealing with stress?", hi: "तनाव से निपटने के बारे में गीता क्या कहती है?" },
  { en: "What is the soul (Atman)? Where do we go after death?", hi: "आत्मा क्या है? मृत्यु के बाद हम कहाँ जाते हैं?" },
  { en: "How can I live a truly dharmic life today?", hi: "आज के समय में धर्मपूर्ण जीवन कैसे जिएं?" },
  { en: "Why is Hanuman not a monkey? What is the real story?", hi: "हनुमान जी बन्दर नहीं थे — असली कहानी क्या है?" },
]

const STATS = [
  { num: '14', label: 'Vedic Scriptures', sub: 'in knowledge base' },
  { num: '100%', label: 'Free to Join', sub: '$1 identity verify' },
  { num: '25%', label: 'To Partner Orgs', sub: 'per certification' },
  { num: '25%', label: 'To Charity', sub: 'per certification' },
]

const formatMessage = (text: string) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const formatted = parts.map((p, j) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={j} style={{ color: '#5C2200' }}>{p.slice(2, -2)}</strong>
        : p
    )
    return <p key={i} style={{ margin: '3px 0', lineHeight: 1.75 }}>{formatted}</p>
  })
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

  const s: Record<string, any> = {
    // Layout
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)' },
    // Header
    header: {
      background: 'linear-gradient(135deg, #2C0E00 0%, #5C2200 50%, #3D1200 100%)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 4px 20px rgba(60,18,0,0.4)',
    },
    headerInner: {
      maxWidth: 1100, margin: '0 auto', padding: '12px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
    omBadge: {
      width: 46, height: 46, borderRadius: '50%',
      background: 'linear-gradient(135deg, #F5C842, #E8851A)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, color: '#3D1200', fontFamily: 'var(--font-devanagari)',
      fontWeight: 'bold', boxShadow: '0 0 20px rgba(245,200,66,0.5)',
      flexShrink: 0,
    },
    logoText: { fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#FFF8E7' },
    logoSub: { fontSize: '0.65rem', color: '#F5C842', letterSpacing: '1.5px', textTransform: 'uppercase' as const },
    nav: { display: 'flex', gap: 4, alignItems: 'center' },
    navBtn: (active: boolean): React.CSSProperties => ({
      padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
      background: active ? 'linear-gradient(135deg, #F5C842, #E8851A)' : 'transparent',
      color: active ? '#3D1200' : '#F5D99A',
      fontSize: '0.8rem', fontWeight: active ? 700 : 400,
      transition: 'all 0.2s', fontFamily: 'var(--font-body)',
    }),
    goldLine: { height: 3, background: 'linear-gradient(90deg, transparent, #F5C842, #E8851A, #F5C842, transparent)' },
    // Main
    main: { flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '0 20px' },
    // Hero
    hero: {
      textAlign: 'center' as const, padding: '50px 20px 30px',
      background: 'radial-gradient(ellipse at center top, rgba(196,80,14,0.08) 0%, transparent 70%)',
    },
    heroOm: {
      fontSize: '5rem', lineHeight: 1, fontFamily: 'var(--font-devanagari)',
      color: 'var(--saffron)', marginBottom: 12,
      textShadow: '0 4px 20px rgba(196,80,14,0.3)',
    },
    heroTitle: { fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: 'var(--darkest)', marginBottom: 10 },
    heroSub: { fontSize: '1.05rem', color: 'var(--text-sub)', maxWidth: 560, margin: '0 auto 20px', lineHeight: 1.8 },
    heroBadge: {
      display: 'inline-flex', gap: 8, alignItems: 'center',
      background: 'var(--warm-white)', border: '1px solid var(--gold)',
      borderRadius: 24, padding: '6px 18px', color: '#8B6A00',
      fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.3px',
    },
    // Stats bar
    statsBar: {
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
      padding: '20px 0 30px',
    },
    statCard: {
      background: 'var(--warm-white)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '16px', textAlign: 'center' as const,
      boxShadow: '0 2px 10px rgba(92,34,0,0.06)',
    },
    statNum: { fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: 'var(--saffron)', fontWeight: 700 },
    statLabel: { fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 },
    statSub: { fontSize: '0.72rem', color: 'var(--text-sub)' },
    // Feature grid
    featureGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, padding: '0 0 30px',
    },
    featureCard: (color: string): React.CSSProperties => ({
      background: 'var(--warm-white)', border: `1px solid var(--border)`,
      borderTop: `3px solid ${color}`,
      borderRadius: 16, padding: '24px 20px',
      boxShadow: '0 2px 12px rgba(92,34,0,0.07)',
      cursor: 'pointer', transition: 'all 0.2s',
    }),
    featureIcon: { fontSize: '2rem', marginBottom: 10 },
    featureTitle: { fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--darkest)', marginBottom: 6 },
    featureDesc: { fontSize: '0.88rem', color: 'var(--text-sub)', lineHeight: 1.65 },
    featureBtn: (color: string): React.CSSProperties => ({
      marginTop: 14, display: 'inline-block', padding: '7px 16px',
      background: color, color: '#fff', borderRadius: 20,
      fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer',
      textDecoration: 'none',
    }),
    // AI Chat section
    chatSection: { padding: '10px 0 30px' },
    chatBox: {
      background: 'var(--warm-white)', border: '1px solid var(--border)',
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(92,34,0,0.1)',
    },
    chatHeader: {
      background: 'linear-gradient(135deg, #5C2200, #8B3A0A)',
      padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    chatMessages: {
      height: 440, overflowY: 'auto' as const, padding: '20px',
      display: 'flex', flexDirection: 'column' as const, gap: 16,
    },
    userBubble: {
      alignSelf: 'flex-end' as const, maxWidth: '75%',
      background: 'linear-gradient(135deg, #7A3010, #5C2200)',
      color: '#FFF8E7', borderRadius: '18px 4px 18px 18px',
      padding: '12px 18px', fontSize: '0.93rem', lineHeight: 1.7,
    },
    aiBubble: {
      alignSelf: 'flex-start' as const, maxWidth: '80%',
      background: '#FFFBF0', border: '1px solid var(--gold)',
      borderRadius: '4px 18px 18px 18px',
      padding: '12px 18px', fontSize: '0.93rem',
      boxShadow: '0 2px 10px rgba(92,34,0,0.08)',
    },
    inputArea: {
      padding: '14px 16px', borderTop: '1px solid var(--border)',
      display: 'flex', gap: 10, alignItems: 'flex-end',
    },
    textarea: {
      flex: 1, background: 'transparent', border: 'none', outline: 'none',
      color: 'var(--text-main)', fontSize: '0.93rem', resize: 'none' as const,
      lineHeight: 1.6, fontFamily: 'var(--font-body)',
      maxHeight: 100, overflowY: 'auto' as const,
    },
    sendBtn: (enabled: boolean): React.CSSProperties => ({
      width: 42, height: 42, borderRadius: '50%',
      background: enabled ? 'linear-gradient(135deg, #E8851A, #C4500E)' : '#D4B896',
      border: 'none', cursor: enabled ? 'pointer' : 'not-allowed',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, flexShrink: 0,
      boxShadow: enabled ? '0 3px 12px rgba(196,80,14,0.4)' : 'none',
      transition: 'all 0.2s',
    }),
    // Suggestions grid
    suggestGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 20px 16px',
    },
    suggestBtn: {
      background: 'var(--cream)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', color: 'var(--text-main)',
      fontSize: '0.83rem', cursor: 'pointer', textAlign: 'left' as const,
      lineHeight: 1.5, transition: 'all 0.2s', fontFamily: 'var(--font-body)',
    },
    // Connect Board
    connectSection: { padding: '10px 0 30px' },
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 },
    categoryCard: {
      background: 'var(--warm-white)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '14px 10px', textAlign: 'center' as const,
      cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: '0 1px 6px rgba(92,34,0,0.06)',
    },
    // Certification section
    certSection: { padding: '10px 0 30px' },
    certCard: {
      background: 'linear-gradient(135deg, #2C0E00, #5C2200)',
      borderRadius: 24, padding: '40px', color: '#FFF8E7',
      position: 'relative' as const, overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(60,18,0,0.3)',
    },
    certBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.4)',
      borderRadius: 20, padding: '5px 14px', marginBottom: 16,
      fontSize: '0.78rem', color: '#F5C842', letterSpacing: '1px',
    },
    certTitle: { fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: 10, color: '#FFF8E7' },
    certDesc: { fontSize: '1rem', color: '#F5D99A', lineHeight: 1.8, marginBottom: 24, maxWidth: 580 },
    certSplit: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28,
    },
    splitCard: {
      background: 'rgba(255,255,255,0.08)', borderRadius: 14,
      padding: '16px', textAlign: 'center' as const,
      border: '1px solid rgba(245,200,66,0.2)',
    },
    certBtn: {
      display: 'inline-block', padding: '14px 32px',
      background: 'linear-gradient(135deg, #F5C842, #E8851A)',
      color: '#3D1200', borderRadius: 30, fontWeight: 700,
      fontSize: '1rem', textDecoration: 'none', cursor: 'pointer',
      border: 'none', fontFamily: 'var(--font-display)',
      boxShadow: '0 4px 20px rgba(245,200,66,0.4)',
    },
    // Civic section  
    civicSection: { padding: '10px 0 30px' },
    civicGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    civicCard: (color: string): React.CSSProperties => ({
      background: 'var(--warm-white)', border: `2px solid ${color}`,
      borderRadius: 20, padding: '28px 24px',
      boxShadow: '0 4px 16px rgba(92,34,0,0.08)',
    }),
    // Join section
    joinSection: { padding: '10px 0 50px' },
    joinCard: {
      background: 'var(--warm-white)', border: '1px solid var(--border)',
      borderRadius: 24, padding: '36px', textAlign: 'center' as const,
      boxShadow: '0 4px 20px rgba(92,34,0,0.08)',
    },
    joinBtn: {
      display: 'inline-block', padding: '14px 40px',
      background: 'linear-gradient(135deg, #C4500E, #8B3A0A)',
      color: '#FFF8E7', borderRadius: 30, fontWeight: 700,
      fontSize: '1rem', textDecoration: 'none',
      boxShadow: '0 4px 16px rgba(196,80,14,0.35)',
      fontFamily: 'var(--font-display)',
    },
    // Section headers
    sectionTitle: {
      fontSize: '1.6rem', fontFamily: 'var(--font-display)',
      color: 'var(--darkest)', marginBottom: 6,
    },
    sectionSub: { fontSize: '0.95rem', color: 'var(--text-sub)', marginBottom: 24 },
    sectionDivider: {
      height: 2, background: 'linear-gradient(90deg, var(--saffron), var(--gold), transparent)',
      borderRadius: 2, marginBottom: 24, width: 80,
    },
  }

  const FEATURES = [
    {
      icon: '🤖', title: 'Mitra AI', color: '#C4500E', id: 'ai',
      desc: 'Ask anything about Vedic wisdom, dharma, daily life, spirituality, and Hindu identity. Powered by the 14 Vedic scriptures.',
      btn: 'Ask Mitra',
    },
    {
      icon: '🏢', title: 'Business Directory', color: '#8B3A0A', id: 'directory',
      desc: 'Find verified Dharmic businesses across Canada. Every listing is identity-verified and community-trusted.',
      btn: 'Browse Directory',
    },
    {
      icon: '🏅', title: 'Dharmic Certification', color: '#D4AF37', id: 'certify',
      desc: 'Official certification for Hindu, Sikh, Buddhist & Jain businesses. 50% supports partner orgs and Dharmic charities.',
      btn: 'Get Certified — $100/yr',
    },
    {
      icon: '📋', title: 'Connect Board', color: '#1A5C2A', id: 'connect',
      desc: 'Find members in your city for sports, arts, study groups, seva and more. Posts auto-purge in 30 days. Free for verified members.',
      btn: 'Browse Posts',
    },
    {
      icon: '🗳️', title: 'Civic Connect', color: '#2C5282', id: 'civic',
      desc: 'Connect with Dharmic candidates and volunteers in your riding. Sorted by postal code. Non-partisan and community-driven.',
      btn: 'Explore Civic',
    },
    {
      icon: '🪪', title: 'Member Card', color: '#6B4226', id: 'join',
      desc: 'Get your verified Dharmic Member Card for just $1 CAD. Identity-verified, QR-scannable, valid for 1 year.',
      btn: 'Join for $1',
    },
    {
      icon: '📰', title: 'Articles & Blog', color: '#553C9A', id: 'blog',
      desc: 'News, insights and stories from the Canadian Hindu community. Heritage, culture, dharma and community events.',
      btn: 'Read Articles',
    },
  ]

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo} onClick={() => setActiveSection('home')}>
            <div style={s.omBadge}>{OM}</div>
            <div>
              <div style={s.logoText}>Mitra · मित्र</div>
              <div style={s.logoSub}>Canadian Hindu Community · canadianhindu.ca</div>
            </div>
          </div>
          <nav style={s.nav}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} style={s.navBtn(activeSection === item.id)}
                onClick={() => setActiveSection(item.id)}>
                {item.icon} {item.label}
              </button>
            ))}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 20, padding: 3, marginLeft: 8 }}>
              {(['en', 'hi'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: '4px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: lang === l ? 'linear-gradient(135deg, #F5C842, #E8851A)' : 'transparent',
                  color: lang === l ? '#3D1200' : '#F5D99A',
                  fontSize: '0.75rem', fontWeight: 'bold',
                  fontFamily: l === 'hi' ? 'var(--font-devanagari)' : 'inherit',
                }}>
                  {l === 'en' ? 'EN' : 'हि'}
                </button>
              ))}
            </div>
          </nav>
        </div>
        <div style={s.goldLine} />
      </header>

      <main style={s.main}>

        {/* HOME */}
        {activeSection === 'home' && (
          <>
            <div style={s.hero} className="animate-fadeUp">
              <div style={s.heroOm}>{OM}</div>
              <h1 style={s.heroTitle}>
                {lang === 'hi' ? 'मित्र में आपका स्वागत है 🙏' : 'Welcome to Mitra 🙏'}
              </h1>
              <p style={s.heroSub}>
                {lang === 'hi'
                  ? 'कनाडा में हिन्दू, सिख, बौद्ध और जैन समुदाय का एकमात्र विश्वसनीय मंच — जोड़ें, सत्यापित करें, और एक साथ आगे बढ़ें।'
                  : 'Canada\'s trusted platform for the Hindu, Sikh, Buddhist & Jain community — connect, certify, and thrive together. Rooted in dharma. Built for you.'}
              </p>
              <div style={s.heroBadge}>
                <span>🪷</span>
                <span>धर्मो रक्षति रक्षितः — Dharma Protected, Protects</span>
              </div>
            </div>

            <div style={s.statsBar}>
              {STATS.map((stat, i) => (
                <div key={i} style={s.statCard}>
                  <div style={s.statNum}>{stat.num}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                  <div style={s.statSub}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <div style={s.featureGrid}>
              {FEATURES.map(f => (
                <div key={f.id} style={s.featureCard(f.color)}
                  onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(92,34,0,0.14)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(92,34,0,0.07)' }}>
                  <div style={s.featureIcon}>{f.icon}</div>
                  <div style={s.featureTitle}>{f.title}</div>
                  <div style={s.featureDesc}>{f.desc}</div>
                  <button style={s.featureBtn(f.color)} onClick={() => setActiveSection(f.id)}>
                    {f.btn} →
                  </button>
                </div>
              ))}
            </div>

            {/* Dharmic Revenue Split */}
            <div style={{ background: 'linear-gradient(135deg, #2C0E00, #5C2200)', borderRadius: 24, padding: '36px', marginBottom: 30, color: '#FFF8E7', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#F5C842', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>The Dharmic Model</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>Every $100 Certification Gives Back</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 24 }}>
                {[
                  { pct: '25%', label: 'Partner Organization', sub: 'Temple, sabha, or referring org', icon: '🛕' },
                  { pct: '25%', label: 'Dharmic Charity', sub: 'Selected quarterly with partner', icon: '🙏' },
                  { pct: '50%', label: 'Platform Operations', sub: 'Keeping Mitra free & growing', icon: '🪷' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px', border: '1px solid rgba(245,200,66,0.2)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: '#F5C842', fontWeight: 700 }}>{item.pct}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: '#F5D99A' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MITRA AI */}
        {activeSection === 'ai' && (
          <div style={s.chatSection}>
            <div style={s.sectionTitle}>🤖 Mitra AI — Your Vedic Guide</div>
            <div style={s.sectionDivider} />
            <p style={s.sectionSub}>Ask anything about dharma, Vedic wisdom, Hindu identity, daily life guidance, and more.</p>

            <div style={s.chatBox}>
              <div style={s.chatHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #F5C842, #E8851A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontFamily: 'var(--font-devanagari)', fontWeight: 'bold', color: '#3D1200' }}>{OM}</div>
                  <div>
                    <div style={{ color: '#FFF8E7', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Mitra · मित्र</div>
                    <div style={{ color: '#F5C842', fontSize: '0.68rem', letterSpacing: '1px' }}>VEDIC AI GUIDE · GROQ POWERED</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['en', 'hi'] as const).map(l => (
                    <button key={l} onClick={() => setLang(l)} style={{
                      padding: '4px 12px', borderRadius: 14, border: 'none', cursor: 'pointer',
                      background: lang === l ? 'rgba(245,200,66,0.9)' : 'rgba(255,255,255,0.1)',
                      color: lang === l ? '#3D1200' : '#F5D99A', fontSize: '0.75rem', fontWeight: 'bold',
                    }}>{l === 'en' ? 'EN' : 'हि'}</button>
                  ))}
                  {messages.length > 0 && (
                    <button onClick={() => { setMessages([]); setShowSuggestions(true) }} style={{
                      padding: '4px 12px', borderRadius: 14, border: '1px solid rgba(245,200,66,0.3)',
                      background: 'transparent', color: '#F5D99A', fontSize: '0.72rem', cursor: 'pointer',
                    }}>✦ New Chat</button>
                  )}
                </div>
              </div>

              <div style={s.chatMessages}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0 10px', color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                    <div style={{ fontSize: '3rem', fontFamily: 'var(--font-devanagari)', color: 'var(--saffron)', marginBottom: 8 }}>{OM}</div>
                    <div style={{ fontFamily: 'var(--font-display)', color: 'var(--darkest)', fontSize: '1.1rem', marginBottom: 4 }}>
                      {lang === 'hi' ? 'मित्र से कोई भी प्रश्न पूछें' : 'Ask Mitra anything'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                      Vedic wisdom rooted in 14 scriptures
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} style={msg.role === 'user' ? s.userBubble : s.aiBubble}>
                    {msg.role === 'assistant' ? <div style={{ fontFamily: 'var(--font-body)' }}>{formatMessage(msg.content)}</div> : msg.content}
                  </div>
                ))}
                {loading && (
                  <div style={{ ...s.aiBubble, display: 'flex', gap: 6, alignItems: 'center', padding: '14px 18px' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)', animation: `bounce 1.2s ease-in-out ${d}s infinite` }} />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {showSuggestions && messages.length === 0 && (
                <div style={s.suggestGrid}>
                  {SUGGESTED.map((q, i) => (
                    <button key={i} style={s.suggestBtn}
                      onClick={() => sendMessage(lang === 'hi' ? q.hi : q.en)}
                      onMouseOver={e => { (e.currentTarget).style.borderColor = 'var(--saffron)'; (e.currentTarget).style.background = '#FFF3D6' }}
                      onMouseOut={e => { (e.currentTarget).style.borderColor = 'var(--border)'; (e.currentTarget).style.background = 'var(--cream)' }}>
                      <span style={{ color: 'var(--saffron)', marginRight: 6 }}>✦</span>
                      {lang === 'hi' ? q.hi : q.en}
                    </button>
                  ))}
                </div>
              )}

              <div style={s.inputArea}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder={lang === 'hi' ? 'मित्र से कोई भी प्रश्न पूछें...' : 'Ask Mitra anything about dharma, life, Vedic wisdom...'}
                  rows={1}
                  style={s.textarea}
                  onInput={e => {
                    const t = e.target as HTMLTextAreaElement
                    t.style.height = 'auto'
                    t.style.height = Math.min(t.scrollHeight, 100) + 'px'
                  }}
                />
                <button style={s.sendBtn(!!(input.trim() && !loading))} onClick={() => sendMessage()}>🪷</button>
              </div>
            </div>
          </div>
        )}

        {/* DIRECTORY */}
        {activeSection === 'directory' && (
          <div style={{ padding: '20px 0 30px' }}>
            <div style={s.sectionTitle}>🏢 Dharmic Business Directory</div>
            <div style={s.sectionDivider} />
            <p style={s.sectionSub}>Verified Hindu, Sikh, Buddhist & Jain businesses across Canada. Every listing is identity-verified.</p>
            <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px', textAlign: 'center', boxShadow: '0 4px 16px rgba(92,34,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏢</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--darkest)', marginBottom: 10 }}>Directory Launching Soon</h3>
              <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.8 }}>
                The Dharmic Business Directory will list all certified businesses. Get your Dharmic Certification to be among the first listed when we launch.
              </p>
              <button style={{ ...s.featureBtn('var(--saffron)'), padding: '12px 28px', fontSize: '0.9rem' }}
                onClick={() => setActiveSection('certify')}>
                Get Dharmic Certified →
              </button>
            </div>
          </div>
        )}

        {/* CERTIFICATION */}
        {activeSection === 'certify' && (
          <div style={s.certSection}>
            <div style={s.sectionTitle}>🏅 Dharmic Business Certification</div>
            <div style={s.sectionDivider} />
            <div style={s.certCard}>
              <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '8rem', opacity: 0.05, fontFamily: 'var(--font-devanagari)' }}>{OM}</div>
              <div style={s.certBadge}>🪷 OFFICIAL CERTIFICATION · $100 CAD/YEAR</div>
              <h2 style={s.certTitle}>Dharmic Business Certification</h2>
              <p style={s.certDesc}>
                Official recognition for Hindu, Sikh, Buddhist & Jain business owners in Canada who operate with integrity, seva, and dharmic values. Join a trusted community of verified Dharmic entrepreneurs.
              </p>
              <div style={s.certSplit}>
                {[
                  { pct: '25%', label: 'Partner Org', icon: '🛕', sub: 'Your referring temple or sabha' },
                  { pct: '25%', label: 'Dharmic Charity', icon: '🙏', sub: 'Selected with partner quarterly' },
                  { pct: '50%', label: 'Operations', icon: '🪷', sub: 'Platform & community programs' },
                ].map((item, i) => (
                  <div key={i} style={s.splitCard}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: '1.6rem', color: '#F5C842', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{item.pct}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF8E7', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#F5D99A' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 24 }}>
                {['Official Dharmic Certification badge on your profile', 'Verified listing in Mitra Business Directory', 'Digital certificate (downloadable PDF)', 'QR-verified Member Card valid for 1 year', 'Priority placement in community searches'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: '0.92rem', color: '#F5D99A' }}>
                    <span style={{ color: '#F5C842', fontSize: '1rem' }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={s.certBtn}>
                Apply for Certification — $100/yr 🪷
              </a>
              <p style={{ marginTop: 14, fontSize: '0.78rem', color: '#F5D99A', opacity: 0.8 }}>
                Applications reviewed within 5–7 business days. Identity verification required.
              </p>
            </div>
          </div>
        )}

        {/* CONNECT BOARD */}
        {activeSection === 'connect' && (
          <div style={s.connectSection}>
            <div style={s.sectionTitle}>📋 Connect Board</div>
            <div style={s.sectionDivider} />
            <p style={s.sectionSub}>Find Dharmic community members in your city for hobbies, meetups & more. Free for verified members ($1 identity check). Posts auto-purge in 30 days.</p>
            <div style={s.categoryGrid}>
              {CONNECT_CATEGORIES.map((cat, i) => (
                <div key={i} style={s.categoryCard}
                  onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--saffron)'; (e.currentTarget as HTMLDivElement).style.background = '#FFF3D6' }}
                  onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--warm-white)' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{cat.icon}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>{cat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--darkest)', marginBottom: 10 }}>Connect Board Launching Soon</h3>
              <p style={{ color: 'var(--text-sub)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.8 }}>
                Verified members ($1 identity check) will be able to post and browse connection requests in their city. Posts are city-specific and auto-purge after 30 days.
              </p>
              <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ ...s.certBtn, background: 'linear-gradient(135deg, #C4500E, #8B3A0A)', display: 'inline-block', padding: '12px 28px', fontSize: '0.9rem', color: '#FFF8E7' }}>
                Verify My Identity — $1 CAD 🪷
              </a>
            </div>
          </div>
        )}

        {/* CIVIC */}
        {activeSection === 'civic' && (
          <div style={s.civicSection}>
            <div style={s.sectionTitle}>🗳️ Civic Connect</div>
            <div style={s.sectionDivider} />
            <p style={s.sectionSub}>Connect Dharmic candidates with verified community members in their riding. Sorted by postal code. Completely non-partisan.</p>
            <div style={{ background: '#EBF4FF', border: '1px solid #BEE3F8', borderRadius: 14, padding: '14px 20px', marginBottom: 24, fontSize: '0.85rem', color: '#2C5282' }}>
              ⚖️ <strong>Non-Partisan Notice:</strong> Mitra Civic Connect welcomes candidates of all parties equally. Canadian Hindu Volunteers does not endorse any candidate or political party.
            </div>
            <div style={s.civicGrid}>
              <div style={s.civicCard('#2C5282')}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🏛️</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--darkest)', marginBottom: 8 }}>I Am a Candidate</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', lineHeight: 1.7, marginBottom: 16 }}>
                  Get featured on Mitra Civic Connect and reach verified Dharmic voters in your exact riding. Listed until election day.
                </p>
                <div style={{ marginBottom: 16 }}>
                  {['Featured listing — $50 CAD', 'Riding-wide announcement — $100 CAD', 'Campaign bundle — $129 CAD (save $21)'].map((item, i) => (
                    <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 6, display: 'flex', gap: 8 }}>
                      <span style={{ color: '#2C5282' }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href={ZEFFY_LINKS.featuredCandidate} target="_blank" rel="noopener noreferrer" style={{ ...s.featureBtn('#2C5282'), textAlign: 'center', padding: '10px 20px', fontSize: '0.85rem' }}>
                    Featured Listing — $50 →
                  </a>
                  <a href={ZEFFY_LINKS.ridingAnnouncement} target="_blank" rel="noopener noreferrer" style={{ ...s.featureBtn('#1A365D'), textAlign: 'center', padding: '10px 20px', fontSize: '0.85rem' }}>
                    Riding Announcement — $100 →
                  </a>
                </div>
              </div>
              <div style={s.civicCard('#1A5C2A')}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🙋</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--darkest)', marginBottom: 8 }}>I Want to Volunteer</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', lineHeight: 1.7, marginBottom: 16 }}>
                  Find Dharmic candidates in your riding and offer your support. Enter your postal code to see who is running near you.
                </p>
                <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 8 }}>Enter your postal code to find candidates in your riding:</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" placeholder="e.g. L6Y 0A1" style={{
                      flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)',
                      background: 'white', fontSize: '0.88rem', outline: 'none',
                      fontFamily: 'var(--font-body)',
                    }} />
                    <button style={{ ...s.featureBtn('#1A5C2A'), padding: '8px 16px', fontSize: '0.82rem' }}>
                      Search
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                  Civic Connect launching for the next federal election. <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--saffron)' }}>Verify your membership</a> to be notified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* JOIN */}
        {activeSection === 'join' && (
          <div style={s.joinSection}>
            <div style={s.sectionTitle}>🪪 Join the Mitra Community</div>
            <div style={s.sectionDivider} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div style={s.joinCard}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>🪪</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--darkest)', marginBottom: 10 }}>Verified Member Card</h3>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: 'var(--saffron)', fontWeight: 700, marginBottom: 6 }}>$1 CAD</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: 16 }}>One-time identity verification · Valid 1 year</div>
                <div style={{ marginBottom: 20 }}>
                  {['Identity-verified Member Card', 'Post on the Connect Board', 'Connect with members in your city', 'Access Civic Connect in your riding', 'QR-scannable digital card', 'Chat with Mitra AI (save history)'].map((item, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: 7, display: 'flex', gap: 8, textAlign: 'left' }}>
                      <span style={{ color: 'var(--saffron)', flexShrink: 0 }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={s.joinBtn}>
                  Verify My Identity — $1 🪷
                </a>
                <p style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-sub)' }}>Must be 16+. Identity verified by Canadian Hindu Volunteers.</p>
              </div>
              <div style={{ ...s.joinCard, background: 'linear-gradient(135deg, #2C0E00, #5C2200)', color: '#FFF8E7' }}>
                <div style={{ fontSize: '3rem', marginBottom: 14 }}>🏅</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#FFF8E7', marginBottom: 10 }}>Dharmic Business Certification</h3>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: '#F5C842', fontWeight: 700, marginBottom: 6 }}>$100 CAD</div>
                <div style={{ fontSize: '0.8rem', color: '#F5D99A', marginBottom: 16 }}>Annual certification · Renews yearly</div>
                <div style={{ marginBottom: 20 }}>
                  {['Everything in Member Card', 'Official Dharmic Certification badge', 'Business Directory listing', 'Downloadable PDF certificate', '25% to your referring org', '25% to a Dharmic charity'].map((item, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', color: '#F5D99A', marginBottom: 7, display: 'flex', gap: 8, textAlign: 'left' }}>
                      <span style={{ color: '#F5C842', flexShrink: 0 }}>✓</span> {item}
                    </div>
                  ))}
                </div>
                <a href={ZEFFY_LINKS.dharmicCertification} target="_blank" rel="noopener noreferrer" style={{ ...s.certBtn, display: 'inline-block' }}>
                  Get Certified — $100/yr 🏅
                </a>
                <p style={{ marginTop: 12, fontSize: '0.75rem', color: '#F5D99A', opacity: 0.8 }}>For Hindu, Sikh, Buddhist & Jain business owners.</p>
              </div>
            </div>
          </div>
        )}

        {/* BLOG */}
        {activeSection === 'blog' && (
          <div style={{ padding: '20px 0 40px' }}>
            <div style={s.sectionTitle}>📰 Articles & Community News</div>
            <div style={s.sectionDivider} />
            <p style={s.sectionSub}>Stories, insights and updates from the Canadian Hindu community.</p>

            {/* Category filters */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 28 }}>
              {['All', 'Community', 'Dharma & Spirituality', 'Heritage & Culture', 'Youth', 'Announcements', 'Civic'].map((cat, i) => (
                <button key={i} style={{
                  padding: '6px 16px', borderRadius: 20,
                  border: i === 0 ? 'none' : '1px solid var(--border)',
                  background: i === 0 ? 'var(--saffron)' : 'var(--warm-white)',
                  color: i === 0 ? '#fff' : 'var(--text-sub)',
                  fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>{cat}</button>
              ))}
            </div>

            {/* Featured article */}
            <div style={{
              background: 'linear-gradient(135deg, #2C0E00, #5C2200)',
              borderRadius: 20, padding: '36px', marginBottom: 24, color: '#FFF8E7',
              position: 'relative' as const, overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute' as const, top: -20, right: -20, fontSize: '8rem', opacity: 0.05, fontFamily: 'var(--font-devanagari)' }}>ॐ</div>
              <div style={{ fontSize: '0.72rem', color: '#F5C842', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: 10 }}>📌 Featured · Announcements</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12, color: '#FFF8E7' }}>
                Welcome to the New canadianhindu.ca
              </h2>
              <p style={{ color: '#F5D99A', lineHeight: 1.8, marginBottom: 20, maxWidth: 640, fontSize: '0.95rem' }}>
                Canadian Hindu Volunteers is proud to launch Mitra 2.0 — a complete community platform for Hindus, Sikhs, Buddhists and Jains across Canada. This platform brings together Vedic AI wisdom, a verified business directory, Dharmic certification, civic engagement tools, and community connection — all in one place rooted in dharma.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: '#F5D99A' }}>
                <span>✍️ Canadian Hindu Volunteers</span>
                <span>·</span>
                <span>📅 June 2025</span>
                <span>·</span>
                <span>3 min read</span>
              </div>
            </div>

            {/* Article grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 30 }}>
              {[
                { cat: 'Dharma & Spirituality', title: 'What is Dharmic Certification and Why It Matters', excerpt: 'A new way for Hindu, Sikh, Buddhist and Jain businesses to build community trust and give back through every transaction.', date: 'May 2025', time: '4 min' },
                { cat: 'Civic', title: 'Dharmic Voices in Canadian Democracy', excerpt: 'How the Hindu community can make its voice heard in federal, provincial and municipal elections across Canada.', date: 'April 2025', time: '5 min' },
                { cat: 'Heritage & Culture', title: 'Preserving Vedic Traditions in Canada', excerpt: 'How Canadian Hindu families are keeping ancient traditions alive while raising the next generation in the West.', date: 'March 2025', time: '6 min' },
                { cat: 'Youth', title: 'Hindu Identity and the Canadian-Born Generation', excerpt: 'Young Hindus born in Canada share their journey of connecting with their heritage while growing up in a multicultural society.', date: 'February 2025', time: '7 min' },
                { cat: 'Community', title: 'Canadian Hindu Volunteers — Our Story', excerpt: 'How a small group of dedicated volunteers built a nationwide network serving the Hindu community across Canada.', date: 'January 2025', time: '5 min' },
                { cat: 'Dharma & Spirituality', title: 'Mitra AI — Vedic Wisdom for the Modern Age', excerpt: 'Meet Mitra, your AI Vedic guide powered by the wisdom of 14 ancient scriptures — available 24/7 in English and Hindi.', date: 'December 2024', time: '3 min' },
              ].map((article, i) => (
                <div key={i} style={{
                  background: 'var(--warm-white)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '20px', cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(92,34,0,0.06)',
                  transition: 'all 0.2s',
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(92,34,0,0.12)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 10px rgba(92,34,0,0.06)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--saffron)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 8 }}>{article.cat}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--darkest)', marginBottom: 8, lineHeight: 1.4 }}>{article.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-sub)', lineHeight: 1.65, marginBottom: 14 }}>{article.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                    <span>📅 {article.date}</span>
                    <span>⏱ {article.time} read</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Contribute CTA */}
            <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>✍️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--darkest)', marginBottom: 8 }}>Have a Story to Share?</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', maxWidth: 440, margin: '0 auto 18px', lineHeight: 1.7 }}>
                We welcome articles from community members on dharma, heritage, civic engagement, youth, and Hindu life in Canada.
              </p>
              <a href="mailto:canadianhinduvolunteers@gmail.com?subject=Article Submission" style={{ ...s.featureBtn('#553C9A'), padding: '10px 24px', fontSize: '0.88rem' }}>
                Submit an Article →
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--darkest)', color: '#F5D99A', padding: '24px 20px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF8E7', marginBottom: 4 }}>Mitra · मित्र</div>
            <div style={{ fontSize: '0.8rem', color: '#F5D99A' }}>A Canadian Hindu Volunteers initiative · canadianhindu.ca</div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#F5D99A', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-devanagari)', fontSize: '1rem', color: '#F5C842', marginBottom: 4 }}>धर्मो रक्षति रक्षितः</div>
            For educational & spiritual guidance only · Not a substitute for professional advice
          </div>
          <div style={{ fontSize: '0.78rem', color: '#F5D99A' }}>
            <div>canadianhinduvolunteers@gmail.com</div>
            <div style={{ marginTop: 4 }}>© 2025 Canadian Hindu Volunteers</div>
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        textarea::placeholder { color: var(--text-sub); opacity: 0.7; }
        input::placeholder { color: var(--text-sub); opacity: 0.7; }
        a { transition: opacity 0.2s; }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}

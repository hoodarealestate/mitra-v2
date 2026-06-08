'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }
    window.location.href = '/member'
  }

  const s: Record<string, any> = {
    page: { minHeight: '100vh', background: '#FAF3E0', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', flexDirection: 'column' },
    header: { background: 'linear-gradient(135deg, #0E0400, #1C0A00)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    omBadge: { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F0C060, #D4560A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontFamily: "'Noto Serif Devanagari', serif", color: '#1C0A00' },
    main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
    card: { background: 'white', borderRadius: 16, padding: '48px 44px', width: '100%', maxWidth: 460, boxShadow: '0 8px 48px rgba(28,10,0,0.1)', border: '1px solid rgba(201,146,42,0.15)' },
    label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#2C1200', marginBottom: 6, letterSpacing: '0.3px', textTransform: 'uppercase' as const },
    input: { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(201,146,42,0.35)', fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif", outline: 'none', color: '#1C0A00', background: '#FFFDF8', marginBottom: 20 },
    btn: (disabled: boolean): React.CSSProperties => ({ width: '100%', padding: '16px', background: disabled ? '#D4B896' : 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', border: 'none', borderRadius: 8, fontSize: '1.1rem', fontFamily: "'Yeseva One', serif", cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8 }),
    error: { background: '#FFF5F5', border: '1px solid #FC8181', borderRadius: 8, padding: '12px 16px', color: '#C53030', fontSize: '0.9rem', marginBottom: 20 },
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={s.omBadge}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
        </a>
        <a href="/register" style={{ color: '#F0C060', fontSize: '0.88rem', textDecoration: 'none' }}>New member? Register →</a>
      </header>

      <div style={s.main}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '3rem', color: '#D4560A', marginBottom: 8 }}>ॐ</div>
            <h1 style={{ fontFamily: "'Yeseva One', serif", fontSize: '2rem', color: '#1C0A00', marginBottom: 6 }}>Welcome Back</h1>
            <p style={{ color: '#6B3A1F', fontSize: '0.95rem', fontStyle: 'italic' }}>Log in to your Mitra account</p>
          </div>

          {error && <div style={s.error}>⚠️ {error}</div>}

          <label style={s.label}>Email Address</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="your@email.com" style={s.input} />

          <label style={s.label}>Password</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Your password" style={s.input} />

          <button onClick={login} disabled={loading} style={s.btn(loading) as React.CSSProperties}>
            {loading ? '⏳ Logging in...' : 'Log In →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: '#9B6B3A' }}>
            Don't have an account? <a href="/register" style={{ color: '#D4560A', textDecoration: 'none', fontWeight: 600 }}>Join for free</a>
          </p>
          <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem' }}>
            <a href="/" style={{ color: '#9B6B3A', textDecoration: 'none' }}>← Back to Mitra</a>
          </p>
        </div>
      </div>
    </div>
  )
}

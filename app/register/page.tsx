'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { ZEFFY_LINKS } from '@/lib/constants'

const FAITHS = ['Hindu', 'Sikh', 'Buddhist', 'Jain', 'Ally', 'Prefer not to say']
const PROVINCES = ['AB','BC','MB','NB','NL','NS','ON','PE','QC','SK']

export default function RegisterPage() {
  const [step, setStep] = useState<'form'|'success'|'existing'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
    city: '', province: 'ON', postal_code: '', phone: '', faith: 'Hindu',
  })

  const handle = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.full_name || !form.email || !form.password) {
      setError('Please fill in all required fields.'); return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/verify-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); setLoading(false); return }
      setResult(data)
      setStep(data.is_existing_member ? 'existing' : 'success')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const s: Record<string, any> = {
    page: { minHeight: '100vh', background: '#FAF3E0', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', flexDirection: 'column' },
    header: { background: 'linear-gradient(135deg, #0E0400, #1C0A00)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textDecoration: 'none' },
    omBadge: { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F0C060, #D4560A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontFamily: "'Noto Serif Devanagari', serif", color: '#1C0A00' },
    main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
    card: { background: 'white', borderRadius: 16, padding: '48px 44px', width: '100%', maxWidth: 540, boxShadow: '0 8px 48px rgba(28,10,0,0.1)', border: '1px solid rgba(201,146,42,0.15)' },
    title: { fontFamily: "'Yeseva One', serif", fontSize: '2rem', color: '#1C0A00', marginBottom: 6, textAlign: 'center' as const },
    sub: { color: '#6B3A1F', fontSize: '0.95rem', textAlign: 'center' as const, marginBottom: 32, fontStyle: 'italic' },
    label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#2C1200', marginBottom: 6, letterSpacing: '0.3px', textTransform: 'uppercase' as const },
    input: { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(201,146,42,0.35)', fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif", outline: 'none', color: '#1C0A00', background: '#FFFDF8', marginBottom: 20 },
    select: { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(201,146,42,0.35)', fontSize: '1rem', fontFamily: "'Cormorant Garamond', Georgia, serif", outline: 'none', color: '#1C0A00', background: '#FFFDF8', marginBottom: 20 },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    btn: (disabled: boolean): React.CSSProperties => ({ width: '100%', padding: '16px', background: disabled ? '#D4B896' : 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', border: 'none', borderRadius: 8, fontSize: '1.1rem', fontFamily: "'Yeseva One', serif", cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, transition: 'all 0.2s' }),
    error: { background: '#FFF5F5', border: '1px solid #FC8181', borderRadius: 8, padding: '12px 16px', color: '#C53030', fontSize: '0.9rem', marginBottom: 20 },
    divider: { textAlign: 'center' as const, color: '#9B6B3A', fontSize: '0.85rem', margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 },
    line: { flex: 1, height: 1, background: 'rgba(201,146,42,0.2)' },
  }

  // SUCCESS — existing BD member
  if (step === 'existing') return (
    <div style={s.page}>
      <header style={s.header}>
        <a href="/" style={{ ...s.logo, textDecoration: 'none' }}>
          <div style={s.omBadge}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
        </a>
      </header>
      <div style={s.main}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
          <h1 style={{ ...s.title, color: '#1A4A2E' }}>Welcome Back!</h1>
          <p style={{ ...s.sub, marginBottom: 24 }}>
            You were already a member of Canadian Hindu Volunteers.<br />
            Your account has been created and <strong style={{ color: '#D4560A' }}>automatically verified</strong>.
          </p>
          <div style={{ background: 'linear-gradient(135deg, #0E0400, #1C0A00)', borderRadius: 12, padding: '24px', marginBottom: 28, color: '#FAF3E0' }}>
            <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '1.5rem', color: '#F0C060', marginBottom: 8 }}>🪪 Member Verified ✅</div>
            <div style={{ fontSize: '1.1rem', fontFamily: "'Yeseva One', serif", marginBottom: 4 }}>{result?.full_name || form.full_name}</div>
            <div style={{ color: 'rgba(240,192,96,0.7)', fontSize: '0.85rem' }}>Canadian Hindu Volunteers Member</div>
          </div>
          <a href="/member" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 8, textDecoration: 'none', fontFamily: "'Yeseva One', serif", fontSize: '1rem', marginBottom: 14 }}>
            View My Member Card →
          </a>
          <a href="/login" style={{ display: 'block', padding: '14px', background: 'transparent', color: '#D4560A', borderRadius: 8, textDecoration: 'none', fontFamily: "'Yeseva One', serif", fontSize: '1rem', border: '1px solid rgba(212,86,10,0.3)' }}>
            Log In
          </a>
        </div>
      </div>
    </div>
  )

  // SUCCESS — new member, needs $1 verification
  if (step === 'success') return (
    <div style={s.page}>
      <header style={s.header}>
        <a href="/" style={{ ...s.logo, textDecoration: 'none' }}>
          <div style={s.omBadge}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
        </a>
      </header>
      <div style={s.main}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🪷</div>
          <h1 style={s.title}>Account Created!</h1>
          <p style={{ ...s.sub, marginBottom: 28 }}>
            Welcome to the Mitra community, <strong>{form.full_name.split(' ')[0]}</strong>!<br />
            One last step — verify your identity to unlock full access.
          </p>

          <div style={{ background: '#FAF3E0', border: '1px solid rgba(201,146,42,0.3)', borderRadius: 12, padding: '24px', marginBottom: 28 }}>
            <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.1rem', color: '#1C0A00', marginBottom: 16 }}>Your access right now:</div>
            <div style={{ textAlign: 'left', marginBottom: 12 }}>
              {[
                { text: 'Browse the Mitra platform', done: true },
                { text: 'Chat with Mitra AI', done: true },
                { text: 'Post on Connect Board', done: false },
                { text: 'Connect with members in your city', done: false },
                { text: 'Access Civic Connect', done: false },
                { text: 'Get your Digital Member Card', done: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '0.95rem', color: item.done ? '#1A4A2E' : '#9B6B3A' }}>
                  <span>{item.done ? '✅' : '🔒'}</span> {item.text}
                </div>
              ))}
            </div>
          </div>

          <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '18px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 8, textDecoration: 'none', fontFamily: "'Yeseva One', serif", fontSize: '1.1rem', marginBottom: 14, boxShadow: '0 6px 24px rgba(212,86,10,0.35)' }}>
            Verify My Identity — $1 CAD 🪷
          </a>
          <p style={{ fontSize: '0.82rem', color: '#9B6B3A', marginBottom: 20 }}>
            After paying, return here and log in — your account will be instantly activated.
          </p>
          <a href="/login" style={{ display: 'block', padding: '12px', color: '#D4560A', textDecoration: 'none', fontSize: '0.9rem' }}>
            Already paid? Log in →
          </a>
        </div>
      </div>
    </div>
  )

  // REGISTRATION FORM
  return (
    <div style={s.page}>
      <header style={s.header}>
        <a href="/" style={{ ...s.logo, textDecoration: 'none' }}>
          <div style={s.omBadge}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
        </a>
        <a href="/login" style={{ color: '#F0C060', fontSize: '0.88rem', textDecoration: 'none' }}>Already a member? Log in →</a>
      </header>

      <div style={s.main}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '3rem', color: '#D4560A', marginBottom: 8 }}>ॐ</div>
            <h1 style={s.title}>Join the Community</h1>
            <p style={s.sub}>Create your Mitra account — free to join, $1 to verify</p>
          </div>

          {error && <div style={s.error}>⚠️ {error}</div>}

          <label style={s.label}>Full Name *</label>
          <input name="full_name" value={form.full_name} onChange={handle} placeholder="e.g. Ravi Hooda" style={s.input} />

          <label style={s.label}>Email Address *</label>
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" style={s.input} />

          <div style={s.row}>
            <div>
              <label style={s.label}>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 8 characters" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Confirm Password *</label>
              <input name="confirm_password" type="password" value={form.confirm_password} onChange={handle} placeholder="Repeat password" style={s.input} />
            </div>
          </div>

          <div style={s.row}>
            <div>
              <label style={s.label}>City</label>
              <input name="city" value={form.city} onChange={handle} placeholder="e.g. Brampton" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Province</label>
              <select name="province" value={form.province} onChange={handle} style={s.select}>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div>
              <label style={s.label}>Postal Code</label>
              <input name="postal_code" value={form.postal_code} onChange={handle} placeholder="e.g. L6Y 0A1" style={{ ...s.input, textTransform: 'uppercase' }} />
            </div>
            <div>
              <label style={s.label}>Phone</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="e.g. 416-555-0100" style={s.input} />
            </div>
          </div>

          <label style={s.label}>Faith Background</label>
          <select name="faith" value={form.faith} onChange={handle} style={s.select}>
            {FAITHS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <div style={{ ...s.divider }}>
            <div style={s.line} />
            <span>By joining you agree to our community guidelines</span>
            <div style={s.line} />
          </div>

          <button onClick={submit} disabled={loading} style={s.btn(loading) as React.CSSProperties}>
            {loading ? '⏳ Creating account...' : 'Create My Account 🪷'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#9B6B3A' }}>
            Already have an account? <a href="/login" style={{ color: '#D4560A', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

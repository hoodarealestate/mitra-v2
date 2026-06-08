'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://x.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'x')
import { ZEFFY_LINKS } from '@/lib/constants'

interface Profile {
  id: string
  full_name: string
  email: string
  city: string
  province: string
  faith: string
  is_verified: boolean
  member_since: string
  membership_expires_at: string
  role: string
}

function QRCode({ value, size = 120 }: { value: string; size?: number }) {
  // Simple visual QR placeholder — real QR via URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=1C0A00&bgcolor=F0C060`
  return <img src={qrUrl} alt="Member QR Code" width={size} height={size} style={{ borderRadius: 8 }} />
}

function MemberCard({ profile }: { profile: Profile }) {
  const initials = profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const joinDate = new Date(profile.member_since).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })
  const expiryDate = profile.membership_expires_at
    ? new Date(profile.membership_expires_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short' })
    : 'N/A'
  const memberId = `CHV-${profile.id?.slice(0, 8).toUpperCase()}`

  return (
    <div style={{
      width: 380, background: 'linear-gradient(135deg, #0E0400 0%, #1C0A00 40%, #2C1000 70%, #1C0A00 100%)',
      borderRadius: 20, padding: '28px 28px 24px', color: '#FAF3E0',
      boxShadow: '0 20px 60px rgba(28,10,0,0.4)',
      border: '1px solid rgba(240,192,96,0.2)',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {/* Decorative mandala watermark */}
      <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.06, fontSize: '180px', fontFamily: "'Noto Serif Devanagari', serif", lineHeight: 1 }}>ॐ</div>

      {/* Gold shimmer bar top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #F0C060, #D4560A, #F0C060, transparent)' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '1.4rem', color: '#F0C060', lineHeight: 1 }}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '0.75rem', color: '#F0C060', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Canadian Hindu</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '0.75rem', color: '#F0C060', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Volunteers</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(240,192,96,0.6)', letterSpacing: '1px', textTransform: 'uppercase' }}>Mitra Community</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '0.7rem', color: '#F0C060', letterSpacing: '0.5px' }}>MEMBER CARD</div>
          {profile.is_verified && (
            <div style={{ marginTop: 4, background: 'rgba(26,74,46,0.6)', border: '1px solid rgba(104,211,145,0.4)', borderRadius: 20, padding: '2px 10px', fontSize: '0.65rem', color: '#9AE6B4', letterSpacing: '1px' }}>
              ✓ VERIFIED
            </div>
          )}
        </div>
      </div>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F0C060, #D4560A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#1C0A00',
          flexShrink: 0, boxShadow: '0 4px 12px rgba(240,192,96,0.3)',
        }}>{initials}</div>
        <div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.2rem', color: '#FAF3E0', lineHeight: 1.2 }}>{profile.full_name}</div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(240,192,96,0.7)', marginTop: 3 }}>
            {profile.faith} · {profile.city && profile.province ? `${profile.city}, ${profile.province}` : profile.province || profile.city || 'Canada'}
          </div>
        </div>
      </div>

      {/* Details row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Member ID', value: memberId },
          { label: 'Member Since', value: joinDate },
          { label: 'Valid Until', value: expiryDate },
          { label: 'Status', value: profile.is_verified ? 'Active & Verified' : 'Pending Verification' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: '0.62rem', color: 'rgba(240,192,96,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: '0.82rem', color: '#FAF3E0', fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* QR + Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '0.85rem', color: 'rgba(240,192,96,0.6)', marginBottom: 2 }}>धर्मो रक्षति रक्षितः</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(240,192,96,0.4)', letterSpacing: '0.5px' }}>mitra.canadianhindu.ca</div>
        </div>
        <div style={{ background: '#FAF3E0', padding: 6, borderRadius: 10 }}>
          <QRCode value={`https://mitra.canadianhindu.ca/verify/${profile.id}`} size={80} />
        </div>
      </div>

      {/* Gold bar bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #F0C060, #D4560A, #F0C060, transparent)' }} />
    </div>
  )
}

export default function MemberPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setNotLoggedIn(true); setLoading(false); return }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profileData)
      setLoading(false)
    }
    loadProfile()
  }, [])

  const logout = async () => {
    await getSupabase().auth.signOut()
    window.location.href = '/'
  }

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#FAF3E0', fontFamily: "'Cormorant Garamond', Georgia, serif" },
    header: { background: 'linear-gradient(135deg, #0E0400, #1C0A00)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    omBadge: { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F0C060, #D4560A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontFamily: "'Noto Serif Devanagari', serif", color: '#1C0A00' },
  }

  if (loading) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', color: '#D4560A' }}>
        <div style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '3rem', animation: 'pulse 2s infinite' }}>ॐ</div>
        <div style={{ marginTop: 12, fontStyle: 'italic', color: '#6B3A1F' }}>Loading your member card...</div>
      </div>
    </div>
  )

  if (notLoggedIn) return (
    <div style={{ ...s.page, display: 'flex', flexDirection: 'column' }}>
      <header style={s.header}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={s.omBadge}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
        </a>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', background: 'white', borderRadius: 16, padding: '48px 44px', maxWidth: 420, boxShadow: '0 8px 40px rgba(28,10,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.8rem', color: '#1C0A00', marginBottom: 10 }}>Members Only</h2>
          <p style={{ color: '#6B3A1F', marginBottom: 28, lineHeight: 1.7 }}>Please log in to view your member card and community access.</p>
          <a href="/login" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 8, textDecoration: 'none', fontFamily: "'Yeseva One', serif", marginBottom: 12 }}>Log In →</a>
          <a href="/register" style={{ display: 'block', padding: '12px', color: '#D4560A', textDecoration: 'none', fontSize: '0.9rem' }}>New member? Register free</a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <header style={s.header}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={s.omBadge}>ॐ</div>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.3rem', color: '#FAF3E0' }}>Mitra · मित्र</div>
        </a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/" style={{ color: '#F0C060', fontSize: '0.88rem', textDecoration: 'none' }}>← Back to Mitra</a>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(240,192,96,0.3)', color: '#F0C060', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }}>Log Out</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Yeseva One', serif", fontSize: '2.5rem', color: '#1C0A00', marginBottom: 8 }}>
            Namaste, {profile?.full_name?.split(' ')[0]} 🙏
          </h1>
          <p style={{ color: '#6B3A1F', fontStyle: 'italic', fontSize: '1.05rem' }}>Welcome to your Mitra member dashboard</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 40, alignItems: 'start' }}>

          {/* Member Card */}
          <div>
            <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.2rem', color: '#1C0A00', marginBottom: 16 }}>Your Member Card</h2>
            {profile && <MemberCard profile={profile} />}
            <p style={{ fontSize: '0.78rem', color: '#9B6B3A', marginTop: 12, textAlign: 'center', fontStyle: 'italic' }}>
              QR code verifiable at mitra.canadianhindu.ca
            </p>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Verification status */}
            {!profile?.is_verified ? (
              <div style={{ background: 'white', border: '2px solid #D4560A', borderRadius: 16, padding: '28px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔒</div>
                <h3 style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.2rem', color: '#1C0A00', marginBottom: 8 }}>Verify Your Identity</h3>
                <p style={{ color: '#6B3A1F', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
                  Pay $1 CAD to verify your identity and unlock the full Mitra community — Connect Board, Civic Connect, and your activated Member Card.
                </p>
                <a href={ZEFFY_LINKS.memberVerification} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg, #D4560A, #8B2E00)', color: 'white', borderRadius: 8, textDecoration: 'none', fontFamily: "'Yeseva One', serif", textAlign: 'center', fontSize: '1rem' }}>
                  Verify My Identity — $1 CAD 🪷
                </a>
                <p style={{ fontSize: '0.78rem', color: '#9B6B3A', marginTop: 10, textAlign: 'center' }}>
                  After payment, refresh this page to see your verified status.
                </p>
              </div>
            ) : (
              <div style={{ background: 'linear-gradient(135deg, #0E2C1A, #1A4A2E)', border: '1px solid rgba(104,211,145,0.2)', borderRadius: 16, padding: '28px', color: '#FAF3E0' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅</div>
                <h3 style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.2rem', marginBottom: 8, color: '#9AE6B4' }}>Identity Verified</h3>
                <p style={{ color: 'rgba(250,243,224,0.75)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  You are a verified member of Canadian Hindu Volunteers. Your card is active and all community features are unlocked.
                </p>
              </div>
            )}

            {/* Community access */}
            <div style={{ background: 'white', border: '1px solid rgba(201,146,42,0.15)', borderRadius: 16, padding: '28px' }}>
              <h3 style={{ fontFamily: "'Yeseva One', serif", fontSize: '1.1rem', color: '#1C0A00', marginBottom: 16 }}>Community Access</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '🤖', label: 'Mitra AI', sub: 'Ask Vedic wisdom', href: '/', locked: false },
                  { icon: '📋', label: 'Connect Board', sub: 'Find members in your city', href: '/', locked: !profile?.is_verified },
                  { icon: '🗳️', label: 'Civic Connect', sub: 'Candidates in your riding', href: '/', locked: !profile?.is_verified },
                  { icon: '🏢', label: 'Business Directory', sub: 'Verified Dharmic businesses', href: '/', locked: false },
                  { icon: '🏅', label: 'Get Dharmic Certified', sub: '$100/yr for your business', href: ZEFFY_LINKS.dharmicCertification, locked: false },
                ].map((item, i) => (
                  <a key={i} href={item.locked ? '#' : item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                    borderRadius: 10, border: '1px solid rgba(201,146,42,0.12)',
                    textDecoration: 'none', transition: 'all 0.2s',
                    background: item.locked ? '#F9F4EC' : 'transparent',
                    opacity: item.locked ? 0.65 : 1,
                    cursor: item.locked ? 'not-allowed' : 'pointer',
                  }}
                    onMouseOver={e => { if (!item.locked) (e.currentTarget as any).style.background = '#FAF3E0' }}
                    onMouseOut={e => { if (!item.locked) (e.currentTarget as any).style.background = 'transparent' }}>
                    <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#1C0A00', fontWeight: 600, fontSize: '0.92rem' }}>{item.label}</div>
                      <div style={{ color: '#9B6B3A', fontSize: '0.78rem' }}>{item.sub}</div>
                    </div>
                    <div style={{ color: item.locked ? '#D4B896' : '#D4560A', fontSize: '0.8rem' }}>
                      {item.locked ? '🔒' : '→'}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}

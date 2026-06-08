'use client'
import { useState } from 'react'

export default function AdminPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const importMembers = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/import-members', { method: 'POST' })
      const data = await res.json()
      setStatus(data)
    } catch (err: any) {
      setStatus({ success: false, error: err.message })
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#FDF6E3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{
        background: 'white', borderRadius: 20, padding: 48,
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: 500, width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🪷</div>
        <h1 style={{ fontSize: '1.5rem', color: '#3D1200', marginBottom: 8 }}>
          Mitra 2.0 Admin
        </h1>
        <p style={{ color: '#6B4226', marginBottom: 32, fontSize: '0.95rem' }}>
          Import all 660 members from canadianhindu.ca into Supabase
        </p>

        <button
          onClick={importMembers}
          disabled={loading}
          style={{
            background: loading ? '#D4B896' : 'linear-gradient(135deg, #C4500E, #8B3A0A)',
            color: 'white', border: 'none', borderRadius: 30,
            padding: '14px 40px', fontSize: '1rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%', marginBottom: 24,
          }}>
          {loading ? '⏳ Importing members...' : '🚀 Import All 660 Members'}
        </button>

        {status && (
          <div style={{
            background: status.success ? '#F0FFF4' : '#FFF5F5',
            border: `1px solid ${status.success ? '#9AE6B4' : '#FC8181'}`,
            borderRadius: 12, padding: 20, textAlign: 'left'
          }}>
            {status.success ? (
              <>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅ Success!</div>
                <div style={{ color: '#276749', fontSize: '0.95rem' }}>
                  <strong>Total members in database: {status.total_in_db}</strong>
                </div>
                {status.errors && (
                  <div style={{ color: '#C05621', marginTop: 8, fontSize: '0.85rem' }}>
                    Some errors: {status.errors.join(', ')}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>❌ Error</div>
                <div style={{ color: '#C53030', fontSize: '0.9rem' }}>{status.error}</div>
              </>
            )}
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: '0.75rem', color: '#9B6B3A' }}>
          🔒 This page is for Canadian Hindu Volunteers admin use only
        </p>
      </div>
    </div>
  )
}

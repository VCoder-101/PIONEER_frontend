'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const IconBack = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)

const IconExit = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function TopBar({ backHref, title }) {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderBottom: '1px solid var(--border)',
      background: '#fff', minHeight: '52px',
    }}>
      {backHref ? (
        <Link href={backHref} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '8px',
          color: 'var(--primary)', textDecoration: 'none',
          background: 'var(--primary-light)',
        }}>
          <IconBack />
        </Link>
      ) : <div style={{ width: '36px' }} />}

      {title && (
        <span style={{
          fontFamily: 'var(--font-brand)', fontSize: '16px',
          fontWeight: 700, color: 'var(--text)', letterSpacing: '0.02em',
        }}>
          {title}
        </span>
      )}

      {/* выход — сбрасываем сессию и на главную */}
      <button
        onClick={() => {
          localStorage.removeItem('pioneer_user')
          router.push('/select-role')
        }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '8px',
          color: 'var(--text-muted)', border: 'none', cursor: 'pointer',
          background: '#f3f4f6',
        }}
        title="Выход"
      >
        <IconExit />
      </button>
    </div>
  )
}

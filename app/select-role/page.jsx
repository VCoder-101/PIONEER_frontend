import Link from 'next/link'
import { USER_ROLES } from '@/lib/constants'

const CarIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h8l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
  </svg>
)

const BuildingIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 21h18M9 21V7l6-4v18M9 7H3v14"/>
    <rect x="12" y="11" width="3" height="3"/><rect x="12" y="17" width="3" height="3"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

const icons = { car: CarIcon, building: BuildingIcon, shield: ShieldIcon }

const roleColors = {
  client:       { bg: '#e8effc', color: '#1a56db', border: '#c3d4f7' },
  organization: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  admin:        { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
}

export default function SelectRolePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ height: '16px' }} />
      <div style={{ padding: '20px 24px 32px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'var(--primary)', marginBottom: '16px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-brand)',
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
        }}>
          PIONEER
        </h1>
        <p style={{
          marginTop: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          ПРЕДОСТАВЛЕНИЕ УСЛУГ ТРАНСПОРТНЫМ СРЕДСТВАМ
        </p>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {USER_ROLES.map((role) => {
          const Icon = icons[role.icon]
          const colors = roleColors[role.id]
          return (
            <Link
              key={role.id}
              href={role.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 16px',
                borderRadius: '14px',
                background: '#fff',
                border: `1.5px solid ${colors.border}`,
                textDecoration: 'none',
                transition: 'all 0.18s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                background: colors.bg, color: colors.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '0.01em',
                  marginBottom: '3px',
                }}>
                  {role.label}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {role.description}
                </div>
              </div>
              <svg width="18" height="18" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          )
        })}
      </div>
      <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          © 2026 PIONEER. Агрегатор услуг для ТС
        </p>
      </div>
    </div>
  )
}

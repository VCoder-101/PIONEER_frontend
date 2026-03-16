import Link from 'next/link'
import { USER_ROLES } from '@/lib/constants'
import Footer from '@/components/ui/Footer'

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
const roleStyles = {
  client:       { icon: 'bg-primary-l text-primary', border: 'border-primary-b' },
  organization: { icon: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
  admin:        { icon: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
}

export default function SelectRolePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-4" />
      <div className="px-6 pb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <h1 className="font-brand text-[28px] font-bold text-txt tracking-widest leading-none">PIONEER</h1>
        <p className="mt-1.5 text-[11px] font-medium text-muted tracking-widest uppercase">
          ПРЕДОСТАВЛЕНИЕ УСЛУГ ТРАНСПОРТНЫМ СРЕДСТВАМ
        </p>
      </div>

      <div className="px-5 flex flex-col gap-3 flex-1">
        {USER_ROLES.filter(r => r.id !== 'admin').map((role) => {
          const Icon = icons[role.icon]
          const s = roleStyles[role.id]
          return (
            <Link key={role.id} href={role.href}
              className={`flex items-center gap-4 px-4 py-[18px] rounded-2xl bg-white border-[1.5px] ${s.border} no-underline shadow-sm`}>
              <div className={`flex items-center justify-center shrink-0 rounded-xl ${s.icon}`} style={{ width: 52, height: 52 }}>
                <Icon />
              </div>
              <div className="flex-1">
                <div className="font-brand text-[17px] font-bold text-txt tracking-wide mb-0.5">{role.label}</div>
                <div className="text-[13px] text-muted">{role.description}</div>
              </div>
              <svg width="18" height="18" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          )
        })}
      </div>

      <div className="text-center pb-2 pt-4">
        <Link href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted no-underline px-4 py-2 rounded-full border border-border bg-gray-50 font-medium">
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Вход для администратора
        </Link>
      </div>
      <Footer />
    </div>
  )
}

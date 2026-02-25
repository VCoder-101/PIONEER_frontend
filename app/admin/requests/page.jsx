import TopBar from '@/components/ui/TopBar'

export default function AdminRequestsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref="/select-role" title="АДМИНИСТРИРОВАНИЕ" />
      <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
        <p style={{ fontSize: '15px' }}>Панель администратора — в разработке</p>
      </div>
    </div>
  )
}

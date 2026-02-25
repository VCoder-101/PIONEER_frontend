'use client'

export default function ExitButton() {
  const handleExit = () => {    window.location.href = '/select-role'
  }

  return (
    <button
      onClick={handleExit}
      title="Выход"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '8px',
        color: 'var(--text-muted)', border: 'none', cursor: 'pointer',
        background: '#f3f4f6',
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </button>
  )
}

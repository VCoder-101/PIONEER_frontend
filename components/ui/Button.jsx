export default function Button({ children, onClick, variant = 'primary', fullWidth, disabled, style }) {
  const base = {
    width: fullWidth ? '100%' : 'auto',
    padding: '14px 20px',
    borderRadius: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.18s',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '0.01em',
  }

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(26,86,219,0.25)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1.5px solid var(--primary)',
    },
    ghost: {
      background: 'var(--primary-light)',
      color: 'var(--primary)',
    },
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}

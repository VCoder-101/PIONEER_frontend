export default function Button({ children, onClick, variant = 'primary', fullWidth, disabled, className = '' }) {
  const base = `inline-flex items-center justify-center rounded-[10px] font-body text-[15px] font-semibold tracking-wide transition-all duration-150 px-5 py-[14px] border-none cursor-pointer ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  const variants = {
    primary: 'bg-primary text-white shadow-[0_2px_8px_rgba(26,86,219,0.25)]',
    outline: 'bg-transparent text-primary border border-primary',
    ghost:   'bg-primary-l text-primary',
  }
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

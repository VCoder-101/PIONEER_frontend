'use client'
import { useState } from 'react'

export default function PhoneInput({ value, onChange, label = 'НОМЕР ТЕЛЕФОНА' }) {
  const [focused, setFocused] = useState(false)

  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    let result = '8'
    if (digits.length > 1) result += ' (' + digits.slice(1, 4)
    if (digits.length > 4) result += ') ' + digits.slice(4, 7)
    if (digits.length > 7) result += '-' + digits.slice(7, 9)
    if (digits.length > 9) result += '-' + digits.slice(9, 11)
    return result
  }

  const handleChange = (e) => {
    const formatted = formatPhone(e.target.value)
    onChange(formatted)
  }

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="8 (___) ___-__-__"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '13px 14px',
          border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '10px',
          fontSize: '16px',
          fontFamily: 'var(--font-body)',
          color: 'var(--text)',
          background: '#fff',
          outline: 'none',
          letterSpacing: '0.05em',
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  )
}

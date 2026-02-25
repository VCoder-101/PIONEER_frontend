'use client'
import { useState } from 'react'

export default function SmsInput({ value, onChange }) {
  const [focused, setFocused] = useState(false)

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    onChange(digits)
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
        SMS-КОД
      </label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={value}
        onChange={handleChange}
        placeholder="• • • •"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '13px 14px',
          border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '10px',
          fontSize: '22px',
          fontFamily: 'var(--font-body)',
          color: 'var(--text)',
          background: '#f9fafb',
          outline: 'none',
          letterSpacing: '0.4em',
          textAlign: 'center',
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  )
}

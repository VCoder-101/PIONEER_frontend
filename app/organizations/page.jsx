'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'

const MOCK_CITIES = [
  'Москва', 'Можайск', 'Можга', 'Моздок', 'Мончегорск',
  'Морозовск', 'Моршанск', 'Мосальск', 'Санкт-Петербург',
  'Казань', 'Екатеринбург', 'Новосибирск', 'Симбирск'
]

const MOCK_ORGANIZATIONS = {
  'Москва': [
    { id: 1, name: 'Авангард',        address: 'Походный проезд, д. 10' },
    { id: 2, name: 'АвтоАдмирал',     address: 'ул. Мосфильмовская, д. 53' },
    { id: 3, name: 'Автопилот',        address: 'ул. Маршала Бирюзова, д. 32' },
    { id: 4, name: 'АвтоПланета',      address: 'ул. Рябиновая, д. 95' },
    { id: 5, name: 'Автосеть Очаково', address: 'ул. Юннатов, д. 77' },
    { id: 6, name: 'АвтоСотта',        address: 'ул. Поклонная, д. 3' },
    { id: 7, name: 'АвтоСПА',          address: 'Старокалужское шоссе, д. 13' },
    { id: 8, name: 'АвтоФорсаж',       address: 'ул. Южнопортовая, д. 22' },
  ],
  'Санкт-Петербург': [
    { id: 9,  name: 'АвтоМастер', address: 'Невский проспект, д. 5' },
    { id: 10, name: 'ЧистоАвто',  address: 'ул. Ленина, д. 12' },
  ],
  'Казань': [
    { id: 11, name: 'КазаньАвто', address: 'ул. Баумана, д. 30' },
  ],
}

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const EmptyState = ({ city }) => (
  <div className="fade-in" style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div style={{ fontSize: '56px', marginBottom: '16px' }}>
      {city ? '🏢' : '🔍'}
    </div>
    <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
      {city ? 'Организации не найдены' : 'Найдите город'}
    </p>
    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
      {city
        ? `В городе ${city} не найдено организаций по вашему запросу`
        : 'Введите название города и нажмите на иконку поиска'}
    </p>
  </div>
)

export default function OrganizationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') || 'wash'

  const [query, setQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [results, setResults] = useState([])
  const [mode, setMode] = useState('city')
  const [searched, setSearched] = useState(false)
  const [queryError, setQueryError] = useState('')

  const handleSearch = () => {
    if (!query.trim()) {
      setQueryError('Введите название для поиска')
      return
    }
    setQueryError('')
    setSearched(true)

    if (!selectedCity) {
      const found = MOCK_CITIES.filter(c => c.toLowerCase().startsWith(query.toLowerCase()))
      setResults(found)
      setMode('city')
    } else {
      const orgs = MOCK_ORGANIZATIONS[selectedCity] || []
      const found = orgs.filter(o => o.name.toLowerCase().includes(query.toLowerCase()))
      setResults(found)
      setMode('org')
    }
  }

  const handleSelectCity = (city) => {
    setSelectedCity(city)
    setQuery('')
    setSearched(true)
    setQueryError('')
    setResults(MOCK_ORGANIZATIONS[city] || [])
    setMode('org')
  }

  const handleSelectOrg = (org) => {
    router.push(`/service-details?service=${serviceId}&orgId=${org.id}&orgName=${encodeURIComponent(org.name)}&orgAddress=${encodeURIComponent(org.address)}`)
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref="/services" title="ВЫБОР ОРГАНИЗАЦИИ" />

      <div style={{ padding: '16px' }}>
        {selectedCity && (
          <div className="scale-in" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', marginBottom: '12px',
            background: 'var(--primary-light)', borderRadius: '10px',
            border: '1px solid var(--primary)',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
              📍 {selectedCity}
            </span>
            <button onClick={() => { setSelectedCity(''); setResults([]); setQuery(''); setSearched(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '20px', lineHeight: 1 }}>
              ×
            </button>
          </div>
        )}
        <div style={{ marginBottom: queryError ? '6px' : '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setQueryError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={selectedCity ? `Поиск организации...` : 'Введите название города...'}
              style={{
                flex: 1, padding: '12px 14px',
                border: `1.5px solid ${queryError ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: '10px', fontSize: '15px',
                outline: 'none', color: 'var(--text)',
                transition: 'border-color 0.2s',
              }}
            />
            <button onClick={handleSearch} style={{
              padding: '12px 16px', borderRadius: '10px',
              background: 'var(--primary)', color: '#fff',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
              <SearchIcon />
            </button>
          </div>
          {queryError && (
            <div className="fade-in" style={{ marginTop: '6px', fontSize: '12px', color: 'var(--danger)' }}>
              ⚠ {queryError}
            </div>
          )}
        </div>
        {results.length > 0 ? (
          <div>
            <p style={{
              fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px',
              fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {mode === 'city' ? 'Выберите город:' : `Организации в ${selectedCity}:`}
            </p>
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              {results.map((item, idx) => {
                const isCity = mode === 'city'
                const name = isCity ? item : item.name
                const address = isCity ? null : item.address
                return (
                  <button
                    key={idx}
                    className={`fade-in delay-${Math.min(idx + 1, 5)}`}
                    onClick={() => isCity ? handleSelectCity(item) : handleSelectOrg(item)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '14px 16px',
                      background: idx % 2 === 0 ? '#fff' : '#fafafa',
                      border: 'none',
                      borderBottom: idx < results.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '15px', color: 'var(--primary)', fontWeight: 500 }}>{name}</div>
                    {address && (
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>{address}</div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
                    searched && <EmptyState city={selectedCity} />
        )}
        {!searched && !selectedCity && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🗺️</div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              Найдите город
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Введите первые буквы города и нажмите поиск. Например: <b>Мо</b> → Москва
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

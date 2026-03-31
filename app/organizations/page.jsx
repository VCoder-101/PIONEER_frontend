'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import { apiClient } from '@/lib/authFetch'

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

function OrganizationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') || 'wash'

  const [organizations, setOrganizations] = useState([])
  const [query, setQuery]   = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [cityName, setCityName] = useState('Самара')

  useEffect(() => {
    // Загружаем город
    apiClient.get('/organizations/cities/').then(data => {
      const cities = data.results || data
      if (cities.length > 0) setCityName(cities[0].name)
    }).catch(() => {})

    const fetchOrgs = async () => {
      try {
        setLoading(true)
        // Получаем только одобренные активные организации
        const data = await apiClient.get(
          `/organizations/?organization_status=approved&is_active=true&organization_type=${serviceId}`
        )
        setOrganizations(data.results || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrgs()
  }, [])

  const results = organizations.filter(o =>
    query ? o.name.toLowerCase().includes(query.toLowerCase()) : true
  )

  const handleSelectOrg = (org) =>
    router.push(`/service-details?service=${serviceId}&orgId=${org.id}&orgName=${encodeURIComponent(org.name)}&orgAddress=${encodeURIComponent(org.address)}`)

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 px-[14px] py-2.5 mb-4 bg-primary-l rounded-[10px] border border-primary">
        <span className="text-base">📍</span>
        <span className="text-[14px] font-semibold text-primary">{cityName}</span>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по названию..."
          className="flex-1 px-[14px] py-3 border-[1.5px] border-border rounded-[10px] text-[15px] text-txt outline-none font-body" />
        <button className="px-4 py-3 rounded-[10px] bg-primary text-white border-none cursor-pointer flex items-center justify-center">
          <SearchIcon />
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-muted text-[14px]">Загрузка...</div>
      )}

      {error && (
        <div className="text-center py-6 px-4 bg-red-50 rounded-xl border border-red-200 text-[13px] text-red-600">
          ❌ {error}
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          {results.map((org, idx) => (
            <button key={org.id} onClick={() => handleSelectOrg(org)}
              className={`w-full text-left px-4 py-[14px] border-none cursor-pointer
                ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                ${idx < results.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="text-[15px] text-primary font-medium">{org.name}</div>
              <div className="text-[13px] text-muted mt-0.5">{org.address}</div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="fade-in text-center py-12 px-6">
          <div className="text-[56px] mb-4">🏢</div>
          <p className="text-[16px] font-semibold text-txt mb-2">Организации не найдены</p>
          <p className="text-[13px] text-muted">Попробуйте изменить запрос</p>
        </div>
      )}
    </div>
  )
}

export default function OrganizationsPage() {
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/services" title="ВЫБОР ОРГАНИЗАЦИИ" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted text-[14px]">Загрузка...</div>}>
        <OrganizationsContent />
      </Suspense>
      <Footer />
    </div>
  )
}

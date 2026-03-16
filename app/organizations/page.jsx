'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

const MOCK_ORGANIZATIONS = [
  { id: 1, name: 'Авангард',        address: 'Московское шоссе, д. 10' },
  { id: 2, name: 'АвтоАдмирал',     address: 'ул. Ново-Садовая, д. 53' },
  { id: 3, name: 'Автопилот',       address: 'ул. Победы, д. 32' },
  { id: 4, name: 'АвтоПланета',     address: 'ул. Советской Армии, д. 95' },
  { id: 5, name: 'Автосеть Самара', address: 'ул. Молодогвардейская, д. 77' },
  { id: 6, name: 'АвтоСотта',       address: 'Заводское шоссе, д. 3' },
  { id: 7, name: 'АвтоСПА',         address: 'ул. Дачная, д. 13' },
  { id: 8, name: 'АвтоФорсаж',      address: 'ул. Промышленности, д. 22' },
]

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

function OrganizationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') || 'wash'
  const [query, setQuery]       = useState('')
  const [searched, setSearched] = useState(false)

  const results = searched
    ? MOCK_ORGANIZATIONS.filter(o => o.name.toLowerCase().includes(query.toLowerCase()))
    : MOCK_ORGANIZATIONS

  const handleSelectOrg = (org) =>
    router.push(`/service-details?service=${serviceId}&orgId=${org.id}&orgName=${encodeURIComponent(org.name)}&orgAddress=${encodeURIComponent(org.address)}`)

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 px-[14px] py-2.5 mb-4 bg-primary-l rounded-[10px] border border-primary">
        <span className="text-base">📍</span>
        <span className="text-[14px] font-semibold text-primary">Самара</span>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={query} onChange={e => { setQuery(e.target.value); setSearched(true) }}
          placeholder="Поиск по названию..."
          className="flex-1 px-[14px] py-3 border-[1.5px] border-border rounded-[10px] text-[15px] text-txt outline-none font-body" />
        <button className="px-4 py-3 rounded-[10px] bg-primary text-white border-none cursor-pointer flex items-center justify-center">
          <SearchIcon />
        </button>
      </div>
      {results.length > 0 ? (
        <div className="border border-border rounded-xl overflow-hidden">
          {results.map((org, idx) => (
            <button key={org.id} onClick={() => handleSelectOrg(org)}
              className={`fade-in delay-${Math.min(idx + 1, 5)} w-full text-left px-4 py-[14px] border-none cursor-pointer
                ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                ${idx < results.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="text-[15px] text-primary font-medium">{org.name}</div>
              <div className="text-[13px] text-muted mt-0.5">{org.address}</div>
            </button>
          ))}
        </div>
      ) : (
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

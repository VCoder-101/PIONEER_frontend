'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import { apiClient } from '@/lib/authFetch'

function ServiceDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId  = searchParams.get('service')   || 'wash'
  const orgId      = searchParams.get('orgId')      || ''
  const orgName    = searchParams.get('orgName')    || ''
  const orgAddress = searchParams.get('orgAddress') || ''
  const serviceLabel = serviceId === 'wash' ? 'МОЙКА' : 'ШИНОМОНТАЖ'

  const [works, setWorks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true); setError(null)
      try {
        const data = await apiClient.get(`/services/?organization=${orgId}&is_active=true&status=active`)
        setWorks(data.results || [])
      } catch (e) {
        setError(e.message)
      } finally { setLoading(false) }
    }
    if (orgId) fetchServices()
  }, [orgId])

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const selectedWorks = works.filter(w => checked[w.id])
  const totalPrice    = selectedWorks.reduce((s, w) => s + parseFloat(w.price || 0), 0)
  const totalDuration = selectedWorks.reduce((s, w) => s + (w.duration || 0), 0)

  const handleNext = () => {
    const params = new URLSearchParams({
      service: serviceId, orgId, orgName, orgAddress, serviceApiId: selectedWorks[0]?.id || "",
      works: JSON.stringify(selectedWorks),
      totalPrice: totalPrice.toFixed(0),
      totalDuration: totalDuration.toString(),
    })
    router.push(`/booking-time?${params.toString()}`)
  }

  return (
    <div className="px-5 py-4 flex-1 flex flex-col">
      <h2 className="font-brand text-[18px] font-bold text-txt tracking-wide mb-2">
        {serviceLabel}. {orgName}
      </h2>

      {/* Итого */}
      <div className={`flex items-center justify-between px-[14px] py-2.5 mb-4 rounded-[10px] border transition-all
        ${totalPrice > 0 ? 'bg-primary-l border-primary' : 'bg-gray-50 border-border'}`}>
        <span className="text-[14px] text-muted font-medium">Итого:</span>
        <span className={`text-[18px] font-bold font-brand ${totalPrice > 0 ? 'text-primary' : 'text-muted'}`}>
          {totalPrice} RUB
        </span>
      </div>

      {/* Загрузка */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[14px] text-muted">Загрузка услуг...</p>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 rounded-xl border border-red-200 text-[13px] text-red-600 mb-4">
          ❌ {error}
        </div>
      )}

      {/* Список услуг */}
      {!loading && !error && (
        <div className="flex-1 overflow-y-auto border border-border rounded-xl mb-4">
          {works.length === 0 ? (
            <div className="text-center py-10 text-muted text-[14px]">Услуги не найдены</div>
          ) : works.map((work, idx) => (
            <label key={work.id}
              className={`flex items-start gap-3 px-4 py-[14px] cursor-pointer transition-colors
                ${idx < works.length - 1 ? 'border-b border-border' : ''}
                ${checked[work.id] ? 'bg-primary-l' : 'bg-white'}`}>
              <input type="checkbox" checked={!!checked[work.id]} onChange={() => toggle(work.id)}
                className="w-[18px] h-[18px] mt-0.5 shrink-0 cursor-pointer accent-primary" />
              <div className="flex-1">
                <div className={`text-[14px] font-semibold ${checked[work.id] ? 'text-primary' : 'text-txt'}`}>
                  {work.title}
                </div>
                <div className="text-[12px] text-muted mt-0.5">
                  {work.price} RUB, {work.duration} мин
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      <button onClick={handleNext} disabled={selectedWorks.length === 0}
        className={`w-full py-4 rounded-xl font-brand text-[17px] font-bold tracking-widest border-none transition-all
          ${selectedWorks.length > 0 ? 'bg-primary text-white cursor-pointer' : 'bg-border text-muted cursor-not-allowed'}`}>
        ВЫБРАТЬ {selectedWorks.length > 0 ? `(${selectedWorks.length})` : ''}
      </button>
      {selectedWorks.length === 0 && !loading && (
        <p className="text-center text-[12px] text-muted mt-2">Выберите хотя бы одну услугу</p>
      )}
    </div>
  )
}

export default function ServiceDetailsPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') || 'wash'
  const orgId = searchParams.get('orgId') || ''
  const orgName = searchParams.get('orgName') || ''
  const orgAddress = searchParams.get('orgAddress') || ''
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <Suspense fallback={null}>
        <TopBar backHref={`/organizations?service=${serviceId}`} title="СОСТАВ УСЛУГИ" />
        <ServiceDetailsContent />
      </Suspense>
      <Footer />
    </div>
  )
}

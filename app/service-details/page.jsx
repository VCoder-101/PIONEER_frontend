'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import { apiClient } from '@/lib/authFetch'

/* ───── Bottom Sheet с описанием услуги ───── */
function ServiceSheet({ work, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Оверлей */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Сам шит */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl px-5 pt-4 pb-8">
        {/* Тяга */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-start justify-between mb-3">
          <h3 className="font-brand text-[18px] font-bold text-txt tracking-wide flex-1 pr-3">
            {work.title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-muted shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-l border border-primary rounded-lg text-[13px] text-primary font-semibold">
           💰 {work.price} RUB
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-l border border-primary rounded-lg text-[13px] text-primary font-semibold">
            🕒 {work.duration} мин
          </span>
        </div>

        <p className="text-[13px] text-muted font-medium mb-1">Описание услуги</p>
        {work.description ? (
          <p className="text-[14px] text-txt leading-relaxed">{work.description}</p>
        ) : (
          <p className="text-[14px] text-muted italic">Описание не указано</p>
        )}
      </div>
    </>
  )
}

/* ───── Основной контент страницы ───── */
function ServiceDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId  = searchParams.get('service')   || 'wash'
  const orgId      = searchParams.get('orgId')      || ''
  const orgName    = searchParams.get('orgName')    || ''
  const orgAddress = searchParams.get('orgAddress') || ''
  const serviceLabel = serviceId === 'wash' ? 'МОЙКА' : 'ШИНОМОНТАЖ'

  const [works, setWorks]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [sheetWork, setSheetWork]   = useState(null)

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

  const selectedWork = works.find(w => w.id === selectedId) || null

  const handleNext = () => {
    if (!selectedWork) return
    const params = new URLSearchParams({
      service: serviceId, orgId, orgName, orgAddress,
      serviceApiId: selectedWork.id,
      works: JSON.stringify([selectedWork]),
      totalPrice: parseFloat(selectedWork.price || 0).toFixed(0),
      totalDuration: String(selectedWork.duration || 0),
    })
    router.push(`/booking-time?${params.toString()}`)
  }

  return (
    <>
      <div className="px-5 py-4 flex-1 flex flex-col">
        <h2 className="font-brand text-[18px] font-bold text-txt tracking-wide mb-2">
          {serviceLabel}. {orgName}
        </h2>

        {/* Итого */}
        <div className={`flex items-center justify-between px-[14px] py-2.5 mb-4 rounded-[10px] border transition-all
          ${selectedWork ? 'bg-primary-l border-primary' : 'bg-gray-50 border-border'}`}>
          <span className="text-[14px] text-muted font-medium">Итого:</span>
          <span className={`text-[18px] font-bold font-brand ${selectedWork ? 'text-primary' : 'text-muted'}`}>
            {selectedWork ? `${parseFloat(selectedWork.price || 0).toFixed(0)} RUB` : '0 RUB'}
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

        {/* Список услуг — RADIO */}
        {!loading && !error && (
          <div className="flex-1 overflow-y-auto border border-border rounded-xl mb-4">
            {works.length === 0 ? (
              <div className="text-center py-10 text-muted text-[14px]">Услуги не найдены</div>
            ) : works.map((work, idx) => (
              <div
                key={work.id}
                className={`flex items-center gap-3 px-4 py-[14px] transition-colors
                  ${idx < works.length - 1 ? 'border-b border-border' : ''}
                  ${selectedId === work.id ? 'bg-primary-l' : 'bg-white'}`}
              >
                <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                  <input
                    type="radio"
                    name="work"
                    value={work.id}
                    checked={selectedId === work.id}
                    onChange={() => setSelectedId(work.id)}
                    className="w-[18px] h-[18px] shrink-0 cursor-pointer accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold truncate ${selectedId === work.id ? 'text-primary' : 'text-txt'}`}>
                      {work.title}
                    </div>
                    <div className="text-[12px] text-muted mt-0.5">
                      {work.price} RUB, {work.duration} мин
                    </div>
                  </div>
                </label>

                {/* Кнопка подробнее */}
                <button
                  onClick={() => setSheetWork(work)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-muted text-[13px] font-bold shrink-0 transition-colors"
                  aria-label="Подробнее об услуге"
                >
                  i
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!selectedWork}
          className={`w-full py-4 rounded-xl font-brand text-[17px] font-bold tracking-widest border-none transition-all
            ${selectedWork ? 'bg-primary text-white cursor-pointer' : 'bg-border text-muted cursor-not-allowed'}`}
        >
          ВЫБРАТЬ
        </button>
        {!selectedWork && !loading && (
          <p className="text-center text-[12px] text-muted mt-2">Выберите услугу</p>
        )}
      </div>

      {/* Bottom Sheet */}
      {sheetWork && (
        <ServiceSheet work={sheetWork} onClose={() => setSheetWork(null)} />
      )}
    </>
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
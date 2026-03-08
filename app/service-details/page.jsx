'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

const MOCK_WORKS = {
  wash: [
    { id: 1, code: '01', name: 'Мойка днища',               price: 200, duration: 15 },
    { id: 2, code: '02', name: 'Мойка двигателя',           price: 250, duration: 15 },
    { id: 3, code: '03', name: 'Уборка салона пылесосом',   price: 100, duration: 10 },
    { id: 4, code: '04', name: 'Комплексная мойка',         price: 600, duration: 40 },
    { id: 5, code: '05', name: 'Мойка радиатора',           price: 100, duration: 10 },
    { id: 6, code: '06', name: 'Бесконтактная мойка',       price: 200, duration: 15 },
    { id: 7, code: '07', name: 'Мойка с полировкой воском', price: 400, duration: 20 },
    { id: 8, code: '08', name: 'Мойка с чисткой салона',    price: 350, duration: 20 },
    { id: 9, code: '09', name: 'Евромойка',                 price: 700, duration: 45 },
  ],
  tire: [
    { id: 1, code: '01', name: 'Снятие/установка колеса R13', price: 150, duration: 10 },
    { id: 2, code: '02', name: 'Снятие/установка колеса R14', price: 160, duration: 10 },
    { id: 3, code: '03', name: 'Снятие/установка колеса R15', price: 180, duration: 10 },
    { id: 4, code: '04', name: 'Снятие/установка колеса R16', price: 200, duration: 15 },
    { id: 5, code: '05', name: 'Балансировка колеса',          price: 120, duration: 10 },
    { id: 6, code: '06', name: 'Ремонт прокола',              price: 250, duration: 20 },
    { id: 7, code: '07', name: 'Сезонное хранение шин',       price: 500, duration: 15 },
  ],
}

function ServiceDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId  = searchParams.get('service')   || 'wash'
  const orgId      = searchParams.get('orgId')      || '1'
  const orgName    = searchParams.get('orgName')    || 'Авангард'
  const orgAddress = searchParams.get('orgAddress') || 'Походный проезд, д. 10'
  const works = MOCK_WORKS[serviceId] || MOCK_WORKS.wash
  const serviceLabel = serviceId === 'wash' ? 'МОЙКА' : 'ШИНОМОНТАЖ'
  const [checked, setChecked] = useState({})
  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  const selectedWorks = works.filter(w => checked[w.id])
  const totalPrice    = selectedWorks.reduce((s, w) => s + w.price, 0)
  const totalDuration = selectedWorks.reduce((s, w) => s + w.duration, 0)

  const handleNext = () => {
    const params = new URLSearchParams({ service: serviceId, orgId, orgName, orgAddress,
      works: JSON.stringify(selectedWorks), totalPrice: totalPrice.toString(), totalDuration: totalDuration.toString() })
    router.push(`/booking-time?${params.toString()}`)
  }

  return (
    <div className="px-5 py-4 flex-1 flex flex-col">
      <h2 className="font-brand text-[18px] font-bold text-txt tracking-wide mb-2">{serviceLabel}. {orgName}</h2>
      <div className={`flex items-center justify-between px-[14px] py-2.5 mb-4 rounded-[10px] border transition-all ${totalPrice > 0 ? 'bg-primary-l border-primary' : 'bg-gray-50 border-border'}`}>
        <span className="text-[14px] text-muted font-medium">Итого:</span>
        <span className={`text-[18px] font-bold font-brand ${totalPrice > 0 ? 'text-primary' : 'text-muted'}`}>{totalPrice} RUB</span>
      </div>
      <div className="flex-1 overflow-y-auto border border-border rounded-xl mb-4">
        {works.map((work, idx) => (
          <label key={work.id}
            className={`flex items-start gap-3 px-4 py-[14px] cursor-pointer transition-colors ${idx < works.length - 1 ? 'border-b border-border' : ''} ${checked[work.id] ? 'bg-primary-l' : 'bg-white'}`}>
            <input type="checkbox" checked={!!checked[work.id]} onChange={() => toggle(work.id)}
              className="w-[18px] h-[18px] mt-0.5 shrink-0 cursor-pointer accent-primary" />
            <div className="flex-1">
              <div className={`text-[14px] font-semibold ${checked[work.id] ? 'text-primary' : 'text-txt'}`}>{work.code}. {work.name}</div>
              <div className="text-[12px] text-muted mt-0.5">{work.price} RUB, {work.duration} мин</div>
            </div>
          </label>
        ))}
      </div>
      <button onClick={handleNext} disabled={selectedWorks.length === 0}
        className={`w-full py-4 rounded-xl font-brand text-[17px] font-bold tracking-widest border-none transition-all ${selectedWorks.length > 0 ? 'bg-primary text-white cursor-pointer' : 'bg-border text-muted cursor-not-allowed'}`}>
        ВЫБРАТЬ {selectedWorks.length > 0 ? `(${selectedWorks.length})` : ''}
      </button>
      {selectedWorks.length === 0 && <p className="text-center text-[12px] text-muted mt-2">Выберите хотя бы одну услугу</p>}
    </div>
  )
}

export default function ServiceDetailsPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') || 'wash'
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted text-[14px]">Загрузка...</div>}>
      <ServiceDetailsPageInner />
    </Suspense>
  )
}

function ServiceDetailsPageInner() {
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/organizations" title="СОСТАВ УСЛУГИ" />
      <ServiceDetailsContent />
      <Footer />
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

const services = [
  { id: 'wash', title: 'МОЙКА', description: 'Выбор условий мойки', icon: '🚿',
    active: 'bg-primary-l border-primary-b', titleColor: 'text-primary', radio: '#1a56db' },
  { id: 'tire', title: 'ШИНОМОНТАЖ', description: 'Выбор радиуса колеса', icon: '🔧',
    active: 'bg-emerald-50 border-emerald-200', titleColor: 'text-emerald-600', radio: '#059669' },
]

export default function ServicesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('wash')
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar title="УСЛУГИ" backHref="/select-role" />
      <div className="px-5 py-6 flex-1 flex flex-col">
        <p className="fade-in text-[13px] text-muted mb-4 uppercase tracking-widest font-medium">Выберите услугу</p>
        <div className="flex flex-col gap-3 mb-10">
          {services.map((s, idx) => (
            <label key={s.id} className={`fade-in delay-${idx + 1} flex items-center gap-4 px-4 py-[18px] rounded-2xl border-[1.5px] cursor-pointer transition-all ${selected === s.id ? s.active : 'bg-white border-border'}`}>
              <input type="radio" name="service" value={s.id} checked={selected === s.id}
                onChange={() => setSelected(s.id)} className="w-[18px] h-[18px] shrink-0" style={{ accentColor: s.radio }} />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] shrink-0 border ${selected === s.id ? s.active : 'bg-gray-50 border-border'}`}>
                {s.icon}
              </div>
              <div>
                <div className={`font-brand text-[18px] font-bold tracking-widest ${selected === s.id ? s.titleColor : 'text-txt'}`}>{s.title}</div>
                <div className="text-[13px] text-muted mt-0.5">{s.description}</div>
              </div>
            </label>
          ))}
        </div>
        <button onClick={() => router.push(`/organizations?service=${selected}`)}
          className="delay-3 fade-in w-full py-4 bg-primary text-white rounded-xl font-brand text-[17px] font-bold tracking-widest border-none cursor-pointer">
          ВЫБРАТЬ УСЛУГУ
        </button>
      </div>
      <Footer />
    </div>
  )
}

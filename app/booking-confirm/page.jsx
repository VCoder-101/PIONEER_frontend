'use client'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

const CheckIcon = () => (
  <svg width="56" height="56" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

function BookingConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgName       = searchParams.get('orgName')       || 'Авангард'
  const orgAddress    = searchParams.get('orgAddress')    || 'Походный проезд, д. 10'
  const day           = searchParams.get('day')           || 'today'
  const time          = searchParams.get('time')          || '19:10'
  const totalPrice    = searchParams.get('totalPrice')    || '0'
  const totalDuration = searchParams.get('totalDuration') || '0'
  let works = []; try { works = JSON.parse(searchParams.get('works') || '[]') } catch {}
  const dayLabel = day === 'today' ? 'сегодня' : 'завтра'

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(26,86,219,0.3)]">
        <CheckIcon />
      </div>
      <p className="font-brand text-[20px] font-bold text-txt text-center leading-relaxed mb-8 tracking-wide">
        Ждем Вас {dayLabel} в {time}{'\n'}в {orgName} по адресу:{'\n'}{orgAddress}
      </p>
      <div className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-border mb-6">
        <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-2.5">Состав записи</div>
        {works.map((w, i) => (
          <div key={i} className="flex justify-between text-[13px] mb-1.5">
            <span className="text-txt">{w.code}. {w.name}</span>
            <span className="text-muted shrink-0 ml-2">{w.price} RUB</span>
          </div>
        ))}
        <div className="border-t border-border mt-2.5 pt-2.5 flex justify-between">
          <span className="text-[14px] font-bold text-txt">Итого:</span>
          <span className="text-[14px] font-bold text-primary">{totalPrice} RUB · {totalDuration} мин</span>
        </div>
      </div>
      <div className="w-full px-4 py-3 bg-primary-l rounded-[10px] border border-primary-b mb-8">
        <p className="text-[13px] text-primary leading-relaxed m-0">
          ✉️ Подтверждение записи будет отправлено на вашу почту. Проверьте входящие письма.
        </p>
      </div>
      <button onClick={() => router.push('/select-role')}
        className="w-full py-4 bg-primary text-white rounded-xl font-brand text-[17px] font-bold tracking-widest border-none cursor-pointer">
        НА ГЛАВНУЮ
      </button>
    </div>
  )
}

export default function BookingConfirmPage() {
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar title="ЗАПИСЬ ПОДТВЕРЖДЕНА" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted text-[14px]">Загрузка...</div>}>
        <BookingConfirmContent />
      </Suspense>
      <Footer />
    </div>
  )
}

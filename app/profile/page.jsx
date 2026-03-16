'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

const CAR_BRANDS = [
  'Lada', 'Toyota', 'Kia', 'Hyundai', 'Volkswagen',
  'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Mazda',
  'Renault', 'Skoda', 'Ford', 'Mitsubishi', 'Honda',
]

const TIRE_SIZES = ['R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20']

const MOCK_BOOKINGS = [
  { id: 1, org: 'АвтоСПА',   service: 'Мойка',      date: '15 марта', time: '14:30', status: 'done',     price: 600 },
  { id: 2, org: 'Авангард',  service: 'Шиномонтаж', date: '22 марта', time: '11:00', status: 'upcoming', price: 480 },
  { id: 3, org: 'Автопилот', service: 'Мойка',       date: '28 марта', time: '16:20', status: 'upcoming', price: 350 },
]

const statusLabel = { done: 'Завершена', upcoming: 'Предстоит' }
const statusStyle = {
  done:     'bg-gray-100 text-muted',
  upcoming: 'bg-primary-l text-primary',
}

export default function ProfilePage() {
  const router = useRouter()

  const [email, setEmail]     = useState('')
  const [brand, setBrand]     = useState('')
  const [plate, setPlate]     = useState('')
  const [tire, setTire]       = useState('')
  const [saved, setSaved]     = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('pioneer_token')
    const user  = localStorage.getItem('pioneer_user')

    if (!token || !user) {
      router.replace('/login')
      return
    }

    try { setEmail(JSON.parse(user).email || '') } catch {}

    const car = localStorage.getItem('pioneer_car')
    if (car) {
      try {
        const { brand, plate, tire } = JSON.parse(car)
        setBrand(brand || '')
        setPlate(plate || '')
        setTire(tire || '')
      } catch {}
    }

    setLoading(false)
  }, [])

  const handleSave = () => {
    localStorage.setItem('pioneer_car', JSON.stringify({ brand, plate, tire }))
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return null

  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/services" title="ПРОФИЛЬ" hideProfile />

      <div className="px-5 py-6 flex-1 flex flex-col gap-5">

        {/* Email */}
        <div className="fade-in">
          <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-3">Аккаунт</div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-border">
            <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-[14px] text-txt">{email || '—'}</span>
          </div>
        </div>

        {/* Данные автомобиля */}
        <div className="fade-in delay-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] text-muted font-semibold uppercase tracking-widest">Мой автомобиль</div>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="text-[13px] text-primary font-semibold bg-transparent border-none cursor-pointer p-0">
                Изменить
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-[13px] font-semibold text-txt mb-1.5">Марка автомобиля</label>
              {editing ? (
                <select value={brand} onChange={e => setBrand(e.target.value)}
                  className="w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt border-[1.5px] border-border outline-none bg-white font-body">
                  <option value="">Выберите марку</option>
                  {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <div className="px-[14px] py-3 bg-gray-50 rounded-[10px] border border-border text-[15px] text-txt">
                  {brand || <span className="text-muted">Не указано</span>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-txt mb-1.5">Гос. номер</label>
              {editing ? (
                <input type="text" value={plate}
                  onChange={e => setPlate(e.target.value.toUpperCase().slice(0, 9))}
                  placeholder="А123БВ77"
                  className="w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt border-[1.5px] border-border outline-none font-body tracking-widest uppercase"
                />
              ) : (
                <div className="px-[14px] py-3 bg-gray-50 rounded-[10px] border border-border text-[15px] text-txt tracking-widest">
                  {plate || <span className="text-muted">Не указано</span>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-txt mb-1.5">Радиус шин</label>
              {editing ? (
                <div className="flex flex-wrap gap-2">
                  {TIRE_SIZES.map(r => (
                    <button key={r} onClick={() => setTire(r)}
                      className={`px-4 py-2 rounded-lg text-[14px] font-semibold border-none cursor-pointer transition-all
                        ${tire === r ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-[14px] py-3 bg-gray-50 rounded-[10px] border border-border text-[15px] text-txt">
                  {tire || <span className="text-muted">Не указано</span>}
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-muted font-brand text-[15px] font-bold border-none cursor-pointer">
                ОТМЕНА
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-brand text-[15px] font-bold border-none cursor-pointer">
                СОХРАНИТЬ
              </button>
            </div>
          )}

          {saved && (
            <div className="fade-in mt-3 px-4 py-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[13px] text-emerald-600 text-center">
              ✓ Данные сохранены
            </div>
          )}
        </div>

        {/* История записей */}
        <div className="fade-in delay-2">
          <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-3">История записей</div>
          <div className="flex flex-col gap-2">
            {MOCK_BOOKINGS.map(b => (
              <div key={b.id} className="px-4 py-3 bg-white rounded-xl border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-brand text-[15px] font-bold text-txt">{b.org}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[b.status]}`}>
                    {statusLabel[b.status]}
                  </span>
                </div>
                <div className="text-[13px] text-muted">{b.service} · {b.date} в {b.time}</div>
                <div className="text-[13px] font-semibold text-primary mt-0.5">{b.price} RUB</div>
              </div>
            ))}
          </div>
        </div>

        {/* Выход */}
        <button
          onClick={() => {
            localStorage.removeItem('pioneer_user')
            localStorage.removeItem('pioneer_token')
            localStorage.removeItem('pioneer_car')
            router.push('/select-role')
          }}
          className="fade-in delay-3 w-full py-3 rounded-xl border border-border bg-white text-danger font-brand text-[15px] font-bold cursor-pointer mt-2">
          ВЫЙТИ ИЗ АККАУНТА
        </button>

      </div>
      <Footer />
    </div>
  )
}

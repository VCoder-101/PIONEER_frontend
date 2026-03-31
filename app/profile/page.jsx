'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'
import { apiClient } from '@/lib/authFetch'
import { useAuth } from '@/hooks/useAuth'

const CAR_BRANDS = [
  'Lada', 'Toyota', 'Kia', 'Hyundai', 'Volkswagen',
  'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Mazda',
  'Renault', 'Skoda', 'Ford', 'Mitsubishi', 'Honda',
]

const statusLabel = { NEW: 'Новая', CONFIRMED: 'Подтверждена', DONE: 'Завершена', CANCELLED: 'Отменена' }
const statusStyle = {
  NEW:       'bg-primary-l text-primary',
  CONFIRMED: 'bg-emerald-50 text-emerald-600',
  DONE:      'bg-gray-100 text-muted',
  CANCELLED: 'bg-red-50 text-red-500',
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [email, setEmail]   = useState('')
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [cars, setCars]     = useState([])
  const [bookings, setBookings] = useState([])
  const [loadingCars, setLoadingCars]         = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [carForm, setCarForm]   = useState({ brand: '', plate: '', wheel_diameter: 16 })
  const [addingCar, setAddingCar] = useState(false)
  const [carError, setCarError]   = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('pioneer_token')
    if (!token) { router.replace('/login'); return }

    // Загружаем профиль с бэка
    apiClient.get('/users/me/')
      .then(data => {
        setEmail(data.email || '')
        setName(data.name || '')
        setPhone(data.phone || '')
        setCars(data.cars || [])
        setLoadingCars(false)
      })
      .catch(() => {
        // fallback на localStorage
        const userRaw = localStorage.getItem('pioneer_user')
        if (userRaw) {
          try { const u = JSON.parse(userRaw); setEmail(u.email || ''); setName(u.name || '') } catch {}
        }
        setLoadingCars(false)
      })

    // Загружаем историю записей
    apiClient.get('/bookings/?ordering=-created_at')
      .then(data => setBookings(data.results || []))
      .catch(() => {})
      .finally(() => setLoadingBookings(false))
  }, [])

  const handleAddCar = async () => {
    if (!carForm.brand || !carForm.plate) { setCarError('Заполните все поля'); return }
    setCarError(null)
    try {
      const newCar = await apiClient.post('/cars/', {
        brand: carForm.brand,
        license_plate: carForm.plate.toUpperCase(),
        wheel_diameter: parseInt(carForm.wheel_diameter),
      })
      setCars(prev => [...prev, newCar])
      setAddingCar(false)
      setCarForm({ brand: '', plate: '', wheel_diameter: 16 })
    } catch (e) { setCarError(e.message) }
  }

  const handleDeleteCar = async (carId) => {
    try {
      await apiClient.delete(`/cars/${carId}/`)
      setCars(prev => prev.filter(c => c.id !== carId))
    } catch {}
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await apiClient.post(`/bookings/${bookingId}/cancel/`, {})
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    } catch (e) {
      alert(e.message || 'Ошибка отмены записи')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/select-role')
  }

  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/services" title="ПРОФИЛЬ" hideProfile />

      <div className="px-5 py-6 flex-1 flex flex-col gap-5">

        {/* Аккаунт */}
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

        {/* Имя */}
        {name ? (
          <div className="fade-in">
            <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-3">Имя</div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-border">
              <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span className="text-[14px] text-txt">{name}</span>
            </div>
          </div>
        ) : null}

        {/* Телефон */}
        {phone ? (
          <div className="fade-in">
            <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-3">Телефон</div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-border">
              <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
              </svg>
              <span className="text-[14px] text-txt">{phone}</span>
            </div>
          </div>
        ) : null}

        {/* Мои автомобили */}
        <div className="fade-in delay-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] text-muted font-semibold uppercase tracking-widest">Мои автомобили</div>
            <button onClick={() => setAddingCar(true)}
              className="text-[13px] text-primary font-semibold bg-transparent border-none cursor-pointer p-0">
              + Добавить
            </button>
          </div>

          {loadingCars ? (
            <p className="text-[13px] text-muted">Загрузка...</p>
          ) : cars.length === 0 && !addingCar ? (
            <p className="text-[13px] text-muted">Нет добавленных автомобилей</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cars.map(car => (
                <div key={car.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-border">
                  <div>
                    <div className="text-[14px] font-semibold text-txt">{car.brand}</div>
                    <div className="text-[12px] text-muted">{car.license_plate} · R{car.wheel_diameter}</div>
                  </div>
                  <button onClick={() => handleDeleteCar(car.id)}
                    className="text-[12px] text-red-400 bg-transparent border-none cursor-pointer p-0">
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}

          {addingCar && (
            <div className="mt-3 flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-border">
              <select value={carForm.brand} onChange={e => setCarForm(p => ({ ...p, brand: e.target.value }))}
                className="w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt border-[1.5px] border-border outline-none bg-white">
                <option value="">Марка автомобиля</option>
                {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input type="text" value={carForm.plate}
                onChange={e => setCarForm(p => ({ ...p, plate: e.target.value.toUpperCase().slice(0, 9) }))}
                placeholder="Гос. номер (А123БВ77)"
                className="w-full px-[14px] py-3 rounded-[10px] text-[15px] text-txt border-[1.5px] border-border outline-none tracking-widest uppercase"
              />
              <div>
                <label className="block text-[13px] font-semibold text-txt mb-2">Радиус шин</label>
                <div className="flex flex-wrap gap-2">
                  {[13,14,15,16,17,18,19,20].map(r => (
                    <button key={r} onClick={() => setCarForm(p => ({ ...p, wheel_diameter: r }))}
                      className={`px-4 py-2 rounded-lg text-[14px] font-semibold border-none cursor-pointer transition-all
                        ${carForm.wheel_diameter === r ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
                      R{r}
                    </button>
                  ))}
                </div>
              </div>
              {carError && <p className="text-[12px] text-danger">⚠ {carError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setAddingCar(false); setCarError(null) }}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-muted font-brand text-[15px] font-bold border-none cursor-pointer">
                  ОТМЕНА
                </button>
                <button onClick={handleAddCar}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-brand text-[15px] font-bold border-none cursor-pointer">
                  СОХРАНИТЬ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* История записей */}
        <div className="fade-in delay-2">
          <div className="text-[12px] text-muted font-semibold uppercase tracking-widest mb-3">История записей</div>
          {loadingBookings ? (
            <p className="text-[13px] text-muted">Загрузка...</p>
          ) : bookings.length === 0 ? (
            <p className="text-[13px] text-muted">Записей пока нет</p>
          ) : (
            <div className="flex flex-col gap-2">
              {bookings.map(b => (
                <div key={b.id} className="px-4 py-3 bg-white rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold text-txt">{b.service_title || b.serviceMethod}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[b.status] || 'bg-gray-100 text-muted'}`}>
                      {statusLabel[b.status] || b.status}
                    </span>
                  </div>
                  <div className="text-[12px] text-muted">{b.dateTime}</div>
                  <div className="text-[12px] text-muted">{b.carModel} · R{b.wheelDiameter}</div>
                  {b.price && <div className="text-[13px] font-semibold text-primary mt-0.5">{b.price} RUB</div>}
                  {(b.status === 'NEW' || b.status === 'CONFIRMED') && (
                    <button onClick={() => handleCancelBooking(b.id)}
                      className="mt-2 text-[12px] text-red-400 bg-transparent border-none cursor-pointer p-0 underline">
                      Отменить запись
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Выход */}
        <button onClick={handleLogout}
          className="fade-in delay-3 w-full py-3 rounded-xl border border-border bg-white text-danger font-brand text-[15px] font-bold cursor-pointer mt-2">
          ВЫЙТИ ИЗ АККАУНТА
        </button>

      </div>
      <Footer />
    </div>
  )
}

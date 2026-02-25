import './globals.css'

export const metadata = {
  title: 'PIONEER — Агрегатор услуг',
  description: 'Запись на автомойку и шиномонтаж',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <div className="mobile-frame">
          {children}
        </div>
      </body>
    </html>
  )
}

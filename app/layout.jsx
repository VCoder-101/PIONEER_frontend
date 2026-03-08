import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: 'PIONEER — Агрегатор услуг',
  description: 'Запись на автомойку и шиномонтаж',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={cn("font-sans", inter.variable)}>
      <body>
        <div className="mobile-frame">
          {children}
        </div>
      </body>
    </html>
  )
}

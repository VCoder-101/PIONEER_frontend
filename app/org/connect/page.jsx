'use client'
import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

export default function OrgConnectPage() {
  return (
    <div className="page-enter flex flex-col min-h-screen bg-white">
      <TopBar backHref="/select-role" title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" />
      <div className="fade-in px-6 py-10 text-center text-muted flex-1">
        <div className="text-[56px] mb-4">🏢</div>
        <p className="text-[16px] font-semibold text-txt mb-2">Раздел в разработке</p>
        <p className="text-[13px]">Форма подключения организации появится в ближайшее время</p>
      </div>
      <Footer />
    </div>
  )
}

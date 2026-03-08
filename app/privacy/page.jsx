import TopBar from '@/components/ui/TopBar'
import Footer from '@/components/ui/Footer'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar backHref="/register" title="ПОЛИТИКА" />
      <div className="px-6 pt-8 pb-6 flex-1">
        <h1 className="font-brand text-[22px] font-bold text-txt tracking-widest text-center mb-1">Политика конфиденциальности</h1>
        <p className="text-center text-[12px] text-muted mb-8">Последнее обновление: 1 марта 2026 года</p>
        <Section title="1. Общие положения">Настоящая Политика описывает, каким образом PIONEER собирает, использует и защищает персональные данные пользователей приложения.{'\n\n'}Используя Сервис, вы соглашаетесь с условиями настоящей Политики.</Section>
        <Section title="2. Какие данные мы собираем">— Адрес электронной почты — для авторизации и уведомлений{'\n'}— Данные об устройстве — тип устройства, браузер{'\n'}— История записей — информация о заказанных услугах</Section>
        <Section title="3. Как мы используем данные">— Предоставление услуг агрегатора{'\n'}— Отправка подтверждений и уведомлений{'\n'}— Улучшение качества Сервиса{'\n'}— Техническая поддержка{'\n'}— Соблюдение требований законодательства РФ</Section>
        <Section title="4. Хранение и защита">Данные хранятся на серверах на территории Российской Федерации в соответствии с Федеральным законом № 152-ФЗ «О персональных данных». Мы принимаем необходимые меры для защиты данных от несанкционированного доступа.</Section>
        <Section title="5. Передача данных третьим лицам">Мы не продаём ваши данные. Передача возможна только:{'\n'}— Организации-партнёру для подтверждения вашей записи{'\n'}— По требованию уполномоченных органов в рамках закона</Section>
        <Section title="6. Ваши права">Вы вправе получить, исправить или удалить свои данные, а также отозвать согласие на их обработку. Для этого напишите нам:{'\n\n'}📧 pioneer.support@mail.ru{'\n'}📍 г. Самара, Россия</Section>
        <Section title="7. Изменения политики">Актуальная версия Политики всегда доступна в приложении. При существенных изменениях мы уведомим вас по email.</Section>
      </div>
      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="font-brand text-[15px] font-bold text-txt mb-2 tracking-wide">{title}</h2>
      <p className="text-[14px] text-txt leading-7 whitespace-pre-line m-0">{children}</p>
    </div>
  )
}

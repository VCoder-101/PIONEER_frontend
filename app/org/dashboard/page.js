'use client'
import Button from "@/components/ui/Button";
import TopBar from "@/components/ui/TopBar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/componentsShadCN/ui/alert-dialog";
import { useEffect, useState } from "react";
import ServicesBlock from "./components/servicesBlock";
import CalendarBlock from "./components/calendarBlock";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Shedule from "./components/shedule";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";

export default function controlPanelPage(){
    const searchParams = useSearchParams()
    const pageId = searchParams.get('') 
    const [pageOpened, setPageOpened] = useState('services')
    const { userData } = useAuth()
    const [organizationData, setOrganizationData] = useState([])
    const [alertSheduleStatus, setAlertSheduleStatus] = useState(false)

    async function getShedule() {
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        try {
            const response = await authFetch(
            `http://localhost:8000/api/organizations/schedules/`,
                {
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                }
            )

            let data = await response.json()
            const filteredData = data.results.filter(item => item.organization === Number(pageId))
            if(filteredData.length != 0){
                localStorage.setItem('pioneer_shedule_status', true)
                setAlertSheduleStatus(false)
            }else{
                localStorage.setItem('pioneer_shedule_status', false)
                setAlertSheduleStatus(true)
            }
        } catch (err) {
            console.error(err)
            toast("Ошибка загрузки страницы")
        }
    }
    const getOrganizationData = async () => {
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        //setLoadingStatus(false)
        console.log(access_token)
        const response = await fetch(`http://localhost:8000/api/organizations/${pageId}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        if(response.ok){
            const data = await response.json()
            setOrganizationData(data)
            getShedule()
        }else if(!response.ok){
            console.error("NOT OK",response)
        }
    }

    useEffect(() => {
        getOrganizationData()
    }, [])

    useEffect(() => {
        let sheduleStatus = localStorage.getItem("pioneer_shedule_status");
        
        if ((pageOpened !== 'shedule' && pageOpened !== 'control') && sheduleStatus === 'false') {
            setPageOpened('control');
        }
    }, [pageOpened]);


    const renderContent = () => {
        switch(pageOpened) {
            case 'control':
                return (
                <div className="control-panel">
                    <h2>Информация по организации:</h2>
                    <p>
                        Наименование: {organizationData.name} <br/>
                        Краткое: {organizationData.shortName} <br/>
                        Зарегистрирован в системе: {organizationData.organizationDateApproved} <br/>
                        ОГРН: {organizationData.orgOgrn} <br/>
                        ИНН: {organizationData.orgInn} <br/>
                        КПП: {organizationData.orgKpp} <br/>
                    </p>
                    <div className="flex flex-wrap gap-2 my-2">
                        <p className="rounded border py-2 px-2 w-max">Тип: {organizationData.organizationType == 'wash' ? "Детейлинг студия" : organizationData.organizationType == 'tire' ? "Шиномонтаж" : ''}</p>
                        <p className="rounded border py-2 px-2 w-max">Количество услуг: {organizationData.countServices}</p>
                        <p className="rounded border py-2 px-2 w-max">Общая стоимость услуг: {organizationData.summaryPrice}₽</p>
                    </div>
                    <Button onClick={()=>{setPageOpened('shedule')}}>Настроить расписание</Button>
                </div>
                )
            
            case 'services':
                return (
                    <ServicesBlock organizationInfo={organizationData}/>
                )
            
            case 'calendar':
                return (
                    <CalendarBlock/>
                )

            case 'shedule':
                return (
                    <Shedule orgId={pageId}/>
                )
            
            default:
                return (
                <div className="not-found">
                    <h2>Страница не найдена</h2>
                    <p>Режим "{pageOpened}" не существует</p>
                </div>
                )
        }
    }
    return (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
            <TopBar backHref="../" title="Моя организация" />
            
            {/* Кнопки для переключения режимов */}
            <div className="flex gap-4 " style={{ padding: '20px', display: 'flex', gap: '10px' }}>
                <button className={`underline ${pageOpened == 'control' ? 'font-bold' : ''}`} onClick={() => {setPageOpened('control'), getOrganizationData()}}>Управление</button>
                <button className={`underline ${pageOpened == 'services' ? 'font-bold' : ''}`} onClick={() => {setPageOpened('services')}}>Услуги</button>
                <button className={`underline ${pageOpened == 'calendar' ? 'font-bold' : ''}`} onClick={() => setPageOpened('calendar')}>Календарь</button>
            </div>
            
            {/* Рендерим контент через switch */}
            <div className="px-3">
                {renderContent()}
            </div>
            <AlertDialog open={alertSheduleStatus} onOpenChange={setAlertSheduleStatus}>
                <AlertDialogContent className={'px-2'}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Заполните график работы</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={()=>{setPageOpened('shedule')}}>Старт</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
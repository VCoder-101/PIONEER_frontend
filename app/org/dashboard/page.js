'use client'
import Button from "@/components/ui/Button";
import TopBar from "@/components/ui/TopBar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/componentsShadCN/ui/alert-dialog";
import { useEffect, useState } from "react";
import ServicesBlock from "./components/servicesBlock";
import CalendarBlock from "./components/calendarBlock";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

export default function controlPanelPage(){
    const searchParams = useSearchParams()
    const pageId = searchParams.get('') 
    const [pageOpened, setPageOpened] = useState('services')
    const [open, setOpen] = useState(false)
    const { userData } = useAuth()
    const [organizationData, setOrganizationData] = useState([])

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
        console.log("OK",response)
        const data = await response.json()
        console.log("DATA ORG", data)
        setOrganizationData(data)
        }else if(!response.ok){
            console.error("NOT OK",response)
        }
    }

    useEffect(() => {
        getOrganizationData()
    }, [userData, pageId])


    
    /* const organizationData2 = {
        organizationId: 1337,
        userOrganization: true,
        userOrganizationStatus: 'approved',
        organizationFullName: "OOO IDINAHUI",
        organizationShortName: "OBNAL",
        organizationDateRegistration: '10/10/2026',
        organizationDateApproved: '13/10/2026',
        orgOgrn: 12345435212,
        orgInn: 12312312353466765,
        orgKpp: 7777436213476127,
        countServices: 12,
        summaryPrice: 12000,
        organizationServiceWash: true,
        organizationServiceTyre: false,
        services: [
            {
                id: 0,
                title: "Экспресс",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                duration: 30,
                createdAt: '10/01/2026',
                price: 400,
                status: 'active'
            },
            {
                id: 1,
                title: "Комплекс",
                description: 'Lorem ipnsum3232312312412',
                duration: 60,
                createdAt: '10/01/2026',
                price: 600,
                status: 'ghost'
            }
        ]
    }
    const [organizationData, setOrganizationData] = useState(organizationData2) */


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
                    <Button variant="red" onClick={()=>{setOpen(true)}}>Скрыть организацию</Button>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogDescription>
                                Организация не будет выводиться в списке пока вы снова не включите видимость
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogAction className={'bg-red-800 text-white'}>Скрыть</AlertDialogAction>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
        </div>
    )
}
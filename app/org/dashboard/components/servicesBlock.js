'use client'
import Button from "@/components/ui/Button";
import TopBar from "@/components/ui/TopBar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/componentsShadCN/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componentsShadCN/ui/card";
import { Checkbox } from "@/componentsShadCN/ui/checkbox";
import { Input } from "@/componentsShadCN/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/componentsShadCN/ui/input-group";
import { Label } from "@/componentsShadCN/ui/label";
import { Toaster } from "@/componentsShadCN/ui/sonner";
import { Spinner } from "@/componentsShadCN/ui/spinner";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/componentsShadCN/ui/table";
import { Textarea } from "@/componentsShadCN/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { organizationService } from "@/services/organizationService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authFetch } from '@/lib/authFetch'

export default function ServicesBlock({organizationInfo}){
    const searchParams = useSearchParams()
    const pageId = searchParams.get('') 
    const [servicesData, setServicesData] = useState([])
    /* async function getServices(){
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        const response = await fetch(`http://localhost:8000/api/services/?organization=${pageId}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        if(response.ok){
            console.log("OK",response)
            const data = await response.json()
            console.log(data)
            setServicesData(data.results)
        }else if(response.status == 401){
            refreshAccessToken = useAuth()
        }
        else if(!response.ok){
            console.error("NOT OK",response)
        }
    } */
    async function getServices() {
        try {
            const response = await authFetch(
            `http://localhost:8000/api/services/?organization=${pageId}`
            )

            if (!response.ok) {
                //console.error("NOT OK", response)
                toast("Ошибка сервера")
                return
            }

            const data = await response.json()
            setServicesData(data.results)

        } catch (err) {
            console.error("ERROR", err)
        }
    }
    useEffect(()=>{
        getServices()
    }, [pageId])

    const [isExpanded, setIsExpanded] = useState(false)
    
    const truncateText = (text, maxLength = 150) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength)
    }

    // Состояние для отслеживания, какая услуга в режиме редактирования
    const [editingServiceId, setEditingServiceId] = useState(null)
    
    // Состояние для временных данных при редактировании
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        duration: '',
        price: ''
    })

    // Функция для начала редактирования
    const startEditing = (service) => {
        setEditingServiceId(service.id)
        setEditFormData({
        title: service.title,
        description: service.description,
        duration: service.duration,
        price: service.price
        })
    }

    // Функция для обработки изменений в инпутах
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditFormData(prev => ({
        ...prev,
        [name]: value
        }))
    }

    // Функция сохранения
    /* const saveChanges = async (serviceId) => {
        try {
            setIsLoading(true)
            const access_token = localStorage.getItem("pioneer_token")
            
            const response = await fetch(`http://localhost:8000/api/services/${serviceId}/`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editFormData)
            })

            if (response.ok) {
                const updatedService = await response.json()
                // Локальные изменения
                setServicesData(prev => {
                    // prev - это массив услуг
                    return prev.map(service =>
                        service.id === serviceId ? updatedService : service
                    )
                })
                setIsLoading(false)
                toast("Изменения сохранены")

                setEditingServiceId(null)
            } else if (!response.ok){
                setIsLoading(false)
                toast("Ошибка сервера")
            }
        } catch{
            toast("Ошибка")
        }
    } */

    const saveChanges = async (serviceId) => {
        try {
            setIsLoading(true)

            const response = await authFetch(
            `http://localhost:8000/api/services/${serviceId}/`,
            {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editFormData)
            }
            )

            if (!response.ok) {
            toast("Ошибка сервера")
            return
            }

            const updatedService = await response.json()

            setServicesData(prev =>
            prev.map(service =>
                service.id === serviceId ? updatedService : service
            )
            )

            toast("Изменения сохранены")
            setEditingServiceId(null)

        } catch (err) {
            console.error(err)
            toast("Ошибка")
        } finally {
            setIsLoading(false)
        }
        }

    // Функция для отмены редактирования
    const cancelEditing = () => {
        setEditingServiceId(null)
    }

    // /api/services/items/{id}
    /* async function editVisible(id, status){
        setIsLoading(true)
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        console.log("editFormData", editFormData)
        const response = await fetch(`http://localhost:8000/api/services/${id}/`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "status": status == "active" ? "ghost" : "active"
            })
        })
        if(response.ok){
            setIsLoading(false)
            toast(`Услуга ${status == "active" ? "Скрыта" : "Активна"}`)
            const updatedService = await response.json()
            setServicesData(prev => {
                // prev - это массив услуг
                return prev.map(service =>
                    service.id === id ? updatedService : service
                )
            })
        }else if(!response.ok){
            setIsLoading(false)
            toast("Ошибка сервера")
        }
    } */

    async function editVisible(id, status) {
        try {
            setIsLoading(true)

            const response = await authFetch(
            `http://localhost:8000/api/services/${id}/`,
            {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                status: status === "active" ? "ghost" : "active"
                })
            }
            )

            if (!response.ok) {
            toast("Ошибка сервера")
            return
            }

            const updatedService = await response.json()

            setServicesData(prev =>
            prev.map(service =>
                service.id === id ? updatedService : service
            )
            )

            toast(`Услуга ${status === "active" ? "Скрыта" : "Активна"}`)

        } catch (err) {
            console.error(err)
            toast("Ошибка")
        } finally {
            setIsLoading(false)
        }
    }

    const [addServiceStatus, setAddServiceStatus] = useState(false)
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: value
        }))
    }

    /* const createService = async (e) => {
        e.preventDefault()
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        setIsLoading(true)
        const response = await fetch('http://localhost:8000/api/services/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                "organization": organizationInfo.id,
                "title": formData.serviceName,
                "description": formData.serviceDescr,
                "price": formData.servicePrice,
                "duration": formData.serviceDuration,
                "status": "active",
                "is_active": true
            })
        })
        if(response.ok){
            toast("Услуга создана")
            getServices()
            setIsLoading(false)
            setAddServiceStatus(false)
        }else if(!response.ok){
            const error = await response.json()
            toast(`Произошла ошибка: ${error.error}`)
            setIsLoading(false)
        }
    } */

    const createService = async (e) => {
        e.preventDefault()

        try {
            setIsLoading(true)

            const response = await authFetch(
            'http://localhost:8000/api/services/',
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                organization: organizationInfo.id,
                title: formData.serviceName,
                description: formData.serviceDescr,
                price: formData.servicePrice,
                duration: formData.serviceDuration,
                status: "active",
                is_active: true
                })
            }
            )

            if (!response.ok) {
            const error = await response.json()
            toast(`Ошибка: ${error.error}`)
            return
            }

            toast("Услуга создана")
            getServices()
            setAddServiceStatus(false)

        } catch (err) {
            console.error(err)
            toast("Ошибка")
        } finally {
            setIsLoading(false)
        }
    }

    /* async function deleteService(id){
        setIsLoading(true)
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        console.log("editFormData", editFormData)
        const response = await fetch(`http://localhost:8000/api/services/${id}/`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            }
        })
        if(response.ok){
            setIsLoading(false)
            toast(`Услуга удалена`)
            getServices()
        }else if(!response.ok){
            setIsLoading(false)
            toast("Ошибка сервера")
        }
    } */

    async function deleteService(id) {
        try {
            setIsLoading(true)

            const response = await authFetch(
            `http://localhost:8000/api/services/${id}/`,
            {
                method: 'DELETE'
            }
            )

            if (!response.ok) {
            toast("Ошибка сервера")
            return
            }

            toast("Услуга удалена")
            getServices()

        } catch (err) {
            console.error(err)
            toast("Ошибка")
        } finally {
            setIsLoading(false)
        }
    }
    
    return(
        <>
            <div className="services">
                {!addServiceStatus ? <Button className={'mb-4'} fullWidth={true} onClick={()=>{setAddServiceStatus(true)}}>Добавить услугу</Button> : null}
                {addServiceStatus ? 
                    <form onSubmit={createService}>
                        <Label className={'flex flex-col items-start justify-start mb-2'}>
                            <span className="text-left">Название услуги</span>
                            <Input id="serviceName"
                                name="serviceName"
                                value={formData.serviceName}
                                onChange={handleChange}
                                required/>
                        </Label>
                        <Label className={'flex flex-col items-start justify-start mb-2'}>
                            <span className="text-left">Описание</span>
                            <Textarea id="serviceDescr"
                                name="serviceDescr"
                                value={formData.serviceDescr}
                                onChange={handleChange}
                                required/>
                        </Label>
                        <Label className={'flex flex-col items-start justify-start mb-2'}>
                            <span className="text-left">Продолжительность (мин)</span>
                            <Input id="serviceDuration"
                                name="serviceDuration"
                                value={formData.serviceDuration}
                                onChange={handleChange}
                                required/>
                        </Label>
                        <Label className={'flex flex-col items-start justify-start mb-2'}>
                            <span className="text-left">Стоимость</span>
                            <InputGroup>
                                <InputGroupAddon>
                                    <InputGroupText>₽</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput placeholder="0" 
                                    id="servicePrice"
                                    name="servicePrice"
                                    value={formData.servicePrice}
                                    onChange={handleChange}
                                    required
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>RUB</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Label>
                        {organizationInfo.organizationType == 'tire' ? 
                            <div>
                                <span className="text-left">С какими колесами вы работаете?</span>
                                <Label className={'flex flex-col items-start justify-start mb-2'}>
                                    <span className="text-left">Диаметр</span>
                                    <Input placeholder={'8-24'}
                                        id="serviceTireDiameter"
                                        name="serviceTireDiameter"
                                        value={formData.serviceTireDiameter}
                                        onChange={handleChange}
                                        required
                                    />
                                </Label>
                                <Label>
                                    <Checkbox id="serviceRunflat"
                                        name="serviceRunflat"
                                        onCheckedChange={(checked) => {
                                            handleChange({
                                            target: {
                                                name: 'serviceRunflat',
                                                value: checked === true
                                            }
                                            })
                                        }}
                                        value={true}
                                        />
                                    <span className="text-left"
                                    >RunFlat</span>
                                </Label>
                            </div> : null
                        }
                        <Button className={'mt-4'} fullWidth={true} onClick={()=>{setAddServiceStatus(false)}}>Назад</Button>
                        <Button type="submit" className={'mt-4'} fullWidth={true}>Опубликовать</Button>
                    </form>
                : null}
                {servicesData.map((service)=>(
                    <Card key={service.id} size="sm" className="mx-auto mt-6 relative">
                        <CardHeader>
                            {editingServiceId === service.id ? (
                                // Режим редактирования
                                <>
                                    <Input
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleInputChange}
                                    placeholder="Название услуги"
                                    className="mb-2 text-sm"
                                    />
                                    <Textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleInputChange}
                                    placeholder="Описание услуги"
                                    className="mb-2 text-sm"
                                    />
                                </>
                                ) : (
                                    <>
                                        <CardTitle>{service.title}</CardTitle>
                                        <CardDescription>
                                            {isExpanded ? service.description : truncateText(service.description)}
                                            {service.description.length > 150 && (
                                                <span
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className={"ml-1 text-sm font-medium pointed" + isExpanded ? "text-blue-700" : 'text-black'}
                                                >
                                                {isExpanded ? ' Свернуть' : '...'}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </>
                                )
                            }
                        </CardHeader>
                        <CardContent>
                            <p>
                                Дата создания: {service.created_at}
                            </p>
                            {editingServiceId === service.id ? (
                                <>
                                    <div className="mb-2">
                                    <label className="block text-sm font-medium mb-1">Продолжительность:</label>
                                    <Input
                                    className={'text-sm'}
                                        name="duration"
                                        value={editFormData.duration}
                                        onChange={handleInputChange}
                                        placeholder="Продолжительность (минуты)"
                                    />
                                    </div>
                                    <div className="mb-2">
                                    <label className="block text-sm font-medium mb-1">Стоимость:</label>
                                    <Input
                                    className={'text-sm'}
                                        name="price"
                                        value={editFormData.price}
                                        onChange={handleInputChange}
                                        placeholder="Стоимость"
                                    />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>
                                Продолжительность: {service.duration}мин
                                </p>
                                <p>
                                    Стоимость: {service.price}₽ 
                                </p>
                                </>
                            )
                        }
                        <p className="block relative">Статус: {service.status == 'active' ? 'Активный' : service.status == 'ghost' ? 'Скрыт' : 'Не найден'} 
                            <span 
                                className={`absolute rounded aspect-square w-[10px] top-[50%] translate-x-[10px] translate-y-[-50%] ${service.status == "active" ? "bg-green-600" : "bg-gray-500"}`}></span></p>
                        </CardContent>
                        <CardFooter className={'flex gap-2'}>
                            {editingServiceId === service.id ? (
                                // Кнопки в режиме редактирования
                                <>
                                    <Button
                                    onClick={() => saveChanges(service.id)}
                                    customWidth="10px 10px"
                                    customFontSize
                                    className="text-xs bg-green-600 hover:bg-green-700"
                                    >
                                    Сохранить
                                    </Button>
                                    <Button
                                    onClick={cancelEditing}
                                    variant="outline"
                                    customWidth="10px 10px"
                                    customFontSize
                                    className="text-xs"
                                    >
                                    Отмена
                                    </Button>
                                </>
                                ) : (
                                    <>
                                        <Button 
                                            onClick={() => startEditing(service)}
                                            customWidth="10px 10px"
                                            customFontSize
                                            className={'text-xs top-[10px] right-[10px] bg-black'}>
                                            Изменить
                                        </Button>
                                        <AlertDialog>
                                            {service.status == 'active' ? 
                                                <AlertDialogTrigger asChild>
                                                    <Button variant = 'red' customWidth='10px 10px' customFontSize className={'text-xs top-[10px] right-[10px] bg-black'}>
                                                        Скрыть
                                                    </Button>
                                                </AlertDialogTrigger>
                                            : <Button onClick={()=>{editVisible(service.id, service.status)}} variant = 'green' customWidth='10px 10px' customFontSize className={'text-xs top-[10px] right-[10px] bg-black'}>
                                                    Показать
                                                </Button>}
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogDescription>
                                                    Услуга не будет выводиться в списке пока вы снова не включите видимость
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogAction onClick={()=>{editVisible(service.id, service.status)}} className={'bg-red-800 text-white'}>Скрыть</AlertDialogAction>
                                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant = 'red' customWidth='10px 10px' customFontSize className={'text-xs top-[10px] right-[10px] bg-black'}>
                                                    Удалить
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogDescription>
                                                    Услуга будет безвозвратно удалена
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogAction onClick={()=>{deleteService(service.id)}} className={'bg-red-800 text-white'}>Удалить</AlertDialogAction>
                                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                )
                            }
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {isLoading ? 
                <div className='w-full h-full fixed top-0 left-0 bg-black/50'>
                    <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <Spinner className="size-14 text-white" />
                    </div>
                </div> : null
            }
        </>
    )
}
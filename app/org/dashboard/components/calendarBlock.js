'use client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/componentsShadCN/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/componentsShadCN/ui/alert-dialog";
import { Button } from "@/componentsShadCN/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/componentsShadCN/ui/dropdown-menu";
import { Toaster } from "@/componentsShadCN/ui/sonner";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/componentsShadCN/ui/table";
import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authFetch } from '@/lib/authFetch'
import { useSearchParams } from 'next/navigation';

export default function CalendarBlock(){
    const searchParams = useSearchParams()
    const pageId = searchParams.get('') 
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [currentInvoice, setCurrentInvoice] = useState(null)
    const [invoices, setInvoices] = useState([])
    const [arhiveInvoices, setArhiveInvoices] = useState([])
    /* async function getServices(){
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        const response = await fetch(`${API_URL}/bookings/calendar/`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        if(response.ok){
            console.log("OK",response)
            const data = await response.json()
            setInvoices(data.results)
        }else if(!response.ok){
            console.error("NOT OK",response)
        }
    } */
    async function getServices() {
        try {
            const response = await authFetch(
            `${API_URL}/bookings/calendar/${pageId}`
            )

            if (!response.ok) {
                //console.error("NOT OK", response)
                toast("Ошибка сервера")
                return
            }

            const data = await response.json()
            setInvoices(data.results)
            //console.log('data', data)

        } catch (err) {
            //console.error("ERROR", err)
            toast("Ошибка сервера")
        }
    }
    useEffect(()=>{
        getServices()
    }, [])


    const { cancelledInvoices, activeInvoices, newInvoices } = useMemo(() => {
        return {
            cancelledInvoices: invoices.filter(item => item.status === "CANCELLED" || item.status ===  "DONE"),
            activeInvoices: invoices.filter(item => item.status == "CONFIRMED"),
            newInvoices: invoices.filter(item => item.status == "NEW")
        };
    }, [invoices])

    /* async function bookingCancel(invoiceId){
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        const response = await fetch(`${API_URL}/bookings/${invoiceId}/cancel/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        if(response.ok){
            setCurrentInvoice({})
            getServices()
            toast("Запись отменена")
        }else if(!response.ok){
            toast.error("Произошла ошибка сервера")
        }
    } */

    async function bookingCancel(invoiceId) {
        try {
            const response = await authFetch(
            `${API_URL}/bookings/${invoiceId}/cancel/`,
            {
                method: 'POST'
            }
            )

            if (!response.ok) {
            toast.error("Произошла ошибка сервера")
            return
            }

            setCurrentInvoice({})
            await getServices()
            toast("Запись отменена")

        } catch (err) {
            console.error(err)
            toast.error("Ошибка сервера")
        }
    }

    /* async function bookingAccept(invoiceId, status){
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        const response = await fetch(`${API_URL}/bookings/${invoiceId}/`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "status": status
            })
        })
        if(response.ok){
            setCurrentInvoice({})
            getServices()
            toast("Запись подтверждена")
        }else if(!response.ok){
            toast.error("Произошла ошибка сервера")
        }
    } */

    async function bookingAccept(invoiceId, status) {
        try {
            const response = await authFetch(
            `${API_URL}/bookings/${invoiceId}/`,
            {
                method: 'PATCH',
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
            )

            if (!response.ok) {
            toast.error("Произошла ошибка сервера")
            return
            }

            setCurrentInvoice({})
            await getServices()
            toast("Запись подтверждена")

        } catch (err) {
            console.error(err)
            toast.error("Ошибка")
        }
    }
    
    return(
        <>
            <div className="calendar">
                <Accordion type="single" collapsible defaultValue="new">
                    <AccordionItem value="new">
                        <AccordionTrigger>Новые</AccordionTrigger>
                        <AccordionContent className={'max-h-[200px] overflow-scroll'}>
                            <Table className={'overflow'}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Дата</TableHead>
                                        <TableHead>Статус</TableHead>
                                        <TableHead>Автомобиль</TableHead>
                                        <TableHead>Услуга</TableHead>
                                        <TableHead className="text-right">Продолжительность</TableHead>
                                        <TableHead className="text-right">Стоимость</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {newInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} onClick={()=>{
                                            setOpen(true)
                                            setCurrentInvoice(invoice)
                                        }}>
                                        <TableCell className="font-medium">{invoice.dateTime}</TableCell>
                                        <TableCell>{invoice.status}</TableCell>
                                        <TableCell>{invoice.carModel}</TableCell>
                                        <TableCell>{invoice.serviceMethod}</TableCell>
                                        <TableCell className="text-right">{invoice.duration}мин</TableCell>
                                        <TableCell className="text-right">{invoice.price}₽ </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="active">
                        <AccordionTrigger>Активные</AccordionTrigger>
                        <AccordionContent className={'max-h-[200px] overflow-scroll'}>
                            <Table className={'overflow'}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Дата</TableHead>
                                        <TableHead>Статус</TableHead>
                                        <TableHead>Автомобиль</TableHead>
                                        <TableHead>Услуга</TableHead>
                                        <TableHead className="text-right">Продолжительность</TableHead>
                                        <TableHead className="text-right">Стоимость</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activeInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} onClick={()=>{
                                            setOpen(true)
                                            setCurrentInvoice(invoice)
                                        }}>
                                        <TableCell className="font-medium">{invoice.dateTime}</TableCell>
                                        <TableCell>{invoice.status}</TableCell>
                                        <TableCell>{invoice.carModel}</TableCell>
                                        <TableCell>{invoice.serviceMethod}</TableCell>
                                        <TableCell className="text-right">{invoice.duration}мин</TableCell>
                                        <TableCell className="text-right">{invoice.price}₽ </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="archived">
                        <AccordionTrigger>Архив</AccordionTrigger>
                        <AccordionContent className={'max-h-[200px] overflow-scroll'}>
                            <Table className={'overflow'}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Дата</TableHead>
                                        <TableHead>Статус</TableHead>
                                        <TableHead>Автомобиль</TableHead>
                                        <TableHead>Услуга</TableHead>
                                        <TableHead className="text-right">Продолжительность</TableHead>
                                        <TableHead className="text-right">Стоимость</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cancelledInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} onClick={()=>{
                                            setOpen(true)
                                            setCurrentInvoice(invoice)
                                        }}>
                                        <TableCell className="font-medium">{invoice.dateTime}</TableCell>
                                        <TableCell className={invoice.status == "CANCELLED" ? "text-red-900" : null}>{invoice.status}</TableCell>
                                        <TableCell>{invoice.carModel}</TableCell>
                                        <TableCell>{invoice.serviceMethod}</TableCell>
                                        <TableCell className="text-right">{invoice.duration}мин</TableCell>
                                        <TableCell className="text-right">{invoice.price}₽ </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent className={'px-2'}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Бронь №{currentInvoice?.id}</AlertDialogTitle>
                            <AlertDialogDescription>Информация по брони</AlertDialogDescription>
                        </AlertDialogHeader>
                            <div className="block">
                                <Table className={'overflow'}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Статус</TableCell>
                                            <TableCell className={'text-right'}>{currentInvoice?.status}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Клиент</TableCell>
                                            <TableCell className={'text-right'}>{currentInvoice?.customerName}</TableCell>
                                        </TableRow>
                                        {currentInvoice?.customerPhone !== null ?
                                            <TableRow>
                                                <TableCell className="font-medium text-left">Телефон</TableCell>
                                                <TableCell className={'text-right'}>{currentInvoice?.customerPhone}</TableCell>
                                            </TableRow>
                                        : null}
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Автомобиль</TableCell>
                                            <TableCell className={'text-right'}>{currentInvoice?.carModel}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Номер авто</TableCell>
                                            <TableCell className={'text-right'}>Номер авто</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Услуга</TableCell>
                                            <TableCell className={'text-right'}>{currentInvoice?.serviceMethod}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Продолжительность</TableCell>
                                            <TableCell className={'text-right'}>{currentInvoice?.duration}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">Стоимость</TableCell>
                                            <TableCell className={'text-right'}>{currentInvoice?.price}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Закрыть</AlertDialogCancel>
                            {currentInvoice?.status !== "CANCELLED" && currentInvoice?.status !== "DONE" ?
                                <>
                                    {currentInvoice?.status !== "CONFIRMED" ?
                                        <>
                                            <AlertDialogAction onClick={()=>{bookingAccept(currentInvoice?.id, "CONFIRMED")}} className={'bg-green-800 text-white w-[100%]'}>Подтвердить запись</AlertDialogAction>
                                            <AlertDialogAction onClick={()=>{setOpenConfirm(true)}} className={'bg-red-800 text-white w-[100%]'}>Отменить запись</AlertDialogAction>
                                        </>
                                        : <AlertDialogAction onClick={()=>{bookingAccept(currentInvoice?.id, "DONE")}} className={'bg-green-800 text-white w-[100%]'}>Завершить</AlertDialogAction>
                                    }
                                </>
                                : null}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle></AlertDialogTitle>
                            <AlertDialogDescription>
                                Вы действительно хотите отменить бронирование для клиента?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={()=>{bookingCancel(currentInvoice.id)}} className={'bg-red-800 text-white'}>Да</AlertDialogAction>
                            <AlertDialogCancel>Нет</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    )
}
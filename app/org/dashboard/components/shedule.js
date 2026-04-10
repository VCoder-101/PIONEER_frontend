'use client'
import Button from "@/components/ui/Button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/componentsShadCN/ui/drawer";
import { Field, FieldLabel } from "@/componentsShadCN/ui/field";
import { Input } from "@/componentsShadCN/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/componentsShadCN/ui/table";
import { authFetch } from "@/lib/authFetch";
import { Divide } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Shedule({orgId}){
    const [sheduleData, setSheduleData] = useState([])
    async function getShedule(weekDay, dayName) {
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        try {
            setIsLoading(true)

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

            if (!response.ok) {
                toast("Ошибка загрузки страницы")
                return
            }

            let data = await response.json()
            const filteredData = data.results.filter(item => item.organization === Number(orgId))
            setSheduleData(mergeSchedule(defaultSchedule, filteredData))
        } catch (err) {
            console.error(err)
            toast("Ошибка загрузки страницы")
        } finally {
            setIsLoading(false)
        }
    }
    /* useEffect(()=>{
        console.log(sheduleData)
    }, [sheduleData]) */
    useEffect(()=>{
        getShedule()
    },[])
    const defaultSchedule = [
        { id: 'default0', weekdayId: 0, weekdayName: "Понедельник", is_active: false },
        { id: 'default1', weekdayId: 1, weekdayName: "Вторник", is_active: false },
        { id: 'default2', weekdayId: 2, weekdayName: "Среда", is_active: false },
        { id: 'default3', weekdayId: 3, weekdayName: "Четверг", is_active: false },
        { id: 'default4', weekdayId: 4, weekdayName: "Пятница", is_active: false },
        { id: 'default5', weekdayId: 5, weekdayName: "Суббота", is_active: false },
        { id: 'default6', weekdayId: 6, weekdayName: "Воскресенье", is_active: false },
    ]

    const mergeSchedule = (defaultSchedule, apiData) => {
        return defaultSchedule.map(defaultDay => {
            const apiDay = apiData.find(item => item.weekday === defaultDay.weekdayId);
            
            if (apiDay) {
            // Если день есть в API, используем данные оттуда
            return {
                weekdayId: defaultDay.weekdayId,
                weekdayName: defaultDay.weekdayName,
                is_active: apiDay.is_active,
                is_working_day: apiDay.is_working_day,
                open_time: apiDay.open_time,
                close_time: apiDay.close_time,
                break_start: apiDay.break_start,
                break_end: apiDay.break_end,
                slot_duration: apiDay.slot_duration,
                id: apiDay.id,
            };
            } else {
            // Если дня нет в API, возвращаем дефолтный (неактивный)
            return {
                ...defaultDay,
                is_working_day: false,
                open_time: null,
                close_time: null,
                slot_duration: null,
            };
            }
        });
    };

    const [isLoading, setIsLoading] = useState(false)
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('18:00');
    async function editShedule(weekDay, dayName) {
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        try {
            setIsLoading(true)

            const response = await authFetch(
            `http://localhost:8000/api/organizations/schedules/`,
            {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    "organization": Number(orgId),
                    "weekday": weekDay,
                    "is_working_day": true,
                    "open_time": startTime,
                    "close_time": endTime
                })
            }
            )

            if (!response.ok) {
                toast("Ошибка сервера")
                return
            }

            toast(`${dayName} | Часы работы обновлены: ${startTime}-${endTime}`)
            localStorage.setItem('pioneer_shedule_status', true)
            getShedule()
        } catch (err) {
            console.error(err)
            toast("Ошибка")
        } finally {
            setIsLoading(false)
        }
    }
    async function editDay(id, dayName) {
        let access_token
        access_token = localStorage.getItem("pioneer_token")
        try {
            setIsLoading(true)

            const response = await authFetch(
            `http://localhost:8000/api/organizations/schedules/${id}/`,
            {
                method: 'PATCH',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    "open_time": startTime,
                    "close_time": endTime
                })
            }
            )

            if (!response.ok) {
            toast("Ошибка сервера")
            return
            }

            toast(`${dayName} | Часы работы обновлены: ${startTime}-${endTime}`)
            getShedule()

        } catch (err) {
            console.error(err)
            toast("Ошибка")
        } finally {
            setIsLoading(false)
        }
    }
    return(
        <>
            <Table className={'mb-4'}>
                <TableHeader>
                    <TableRow>
                    <TableHead>День</TableHead>
                    <TableHead>Время</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sheduleData.map((item)=>(
                        <TableRow>
                            <TableCell className="font-medium">{item.weekdayName}</TableCell>
                            <TableCell>{item.open_time ? `${item.open_time.slice(0, 5)} - ${item.close_time.slice(0, 5)}` : '--:--'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="grid grid-cols-2 gap-4">
                {
                    sheduleData.map((weekday)=>(
                        <Drawer key={weekday.weekdayId}>
                            <DrawerTrigger><Button onClick={()=>{setStartTime(weekday?.open_time), setEndTime(weekday?.close_time)}} variant={weekday.is_active ? "green" : "primary"} fullWidth={true}>{weekday.weekdayName}</Button></DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                <DrawerTitle className={'font-bold text-3xl mb-4'}>{weekday.weekdayName}</DrawerTitle>
                                <DrawerDescription className={'text-lg'}>Начало рабочего дня</DrawerDescription>
                                    <Input
                                    type="time"
                                    id="time-picker-optional"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-fit my-2 mx-auto text-center py-6 appearance-none bg-background text-2xl [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                <hr/>
                                    <Input
                                    type="time"
                                    id="time-picker-optional"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-max my-2 mx-auto text-center appearance-none py-6 bg-background text-2xl [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                <DrawerDescription className={'text-lg'}>Конец рабочего дня</DrawerDescription>
                                </DrawerHeader>
                                <DrawerFooter>
                                <Button onClick={()=>{weekday.is_active ? editDay(weekday.id, weekday.weekdayName) : editShedule(weekday.weekdayId, weekday.weekdayName)}}>Сохранить</Button>
                                <DrawerClose>
                                    <Button fullWidth={true} variant="outline">Отмена</Button>
                                </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    ))
                }
            </div>
        </>
    )
}
'use client'

import Button from '@/components/ui/Button'
import TopBar from '@/components/ui/TopBar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/componentsShadCN/ui/accordion'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/componentsShadCN/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/componentsShadCN/ui/card'
import { Input } from '@/componentsShadCN/ui/input'
import { Label } from '@/componentsShadCN/ui/label'
import { Textarea } from '@/componentsShadCN/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { organizationService } from '@/services/organizationService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OrgConnectPage() {
  const { userData } = useAuth()
  const router = useRouter()
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [statusAuth, setStatusAuth] = useState(false)
  const [organizationData, setOrganizationData] = useState([])


  useEffect(() => {
    const getOrganizationData = async () => {
      try {
        let access_token = localStorage.getItem("pioneer_token")
        const response = await fetch('http://localhost:8000/api/organizations/', {
            method: 'GET',
            headers: { "Authorization": `Bearer ${access_token}` }
        })
        if(response.ok){
          setStatusAuth(true)
          const data = await response.json()
          setOrganizationData(data.results)
        }
      } catch(e) {
        console.log('Бэкенд недоступен:', e.message)
      }
    }
    getOrganizationData()
  }, [userData])

  const [formData, setFormData] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
  }

  /* const userData = {
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
  } */

  /* function getUserData(){
    const response = await fetch('http://localhost:8000/api/users/auth/verify-code/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({ 
          "name": "Michael",
        }),
    })
    if(response.ok){
      console.log("OK",response)
      const data = await response.json()
    }else if(!response.ok){
      console.log("NOT OK",response)
    }
  } */

  const [open, setOpen] = useState(false)
  const [cancelOrgId, setCancelOrgId] = useState(null)
  const [createOrg, setCreateOrg] = useState(false)
  useEffect(()=>{
    console.log("cancelOrgId", organizationData)
  }, [cancelOrgId])

  if(organizationData.length !== 0 && !createOrg /* && userData.userOrganizationStatus == 'approved' */){
    return(
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
        <TopBar backHref="/select-role" title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" hideProfile />
        {organizationData.map((organization)=>(
          <Card key={organization.id} size="sm" className="mx-auto mt-6 w-[90%] max-w-sm relative">
            <CardHeader className={'w-[255px]'}>
              <CardTitle>Заявка номер: {organization.id}</CardTitle>
              <CardDescription>
                {organization.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Дата создания: {organization.created_at}
              </p>
              {organization.organizationDateApproved !== null ? 
                <p>
                  Дата Подтверждения: {organization.organizationDateApproved}
                </p> : null
              }
              <p>
                Статус вашей заявки: {
                organization.organizationStatus == 'pending' ? 
                  <span className='font-bold'>В работе</span> : 
                organization.organizationStatus == 'approved' ?
                  <span className='font-bold text-green-900'>Подтверждена</span> :
                organization.organizationStatus == 'rejected' ?
                  <span className='font-bold text-red-900'>Отклонена</span> : <span>Загрузка</span> 
              }
              </p>
            </CardContent>
            <CardFooter>
              <Accordion collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Подробнее</AccordionTrigger>
                  <AccordionContent>
                    Полное наименование организации: {organization.name} <br/>
                    Наименование организации: {organization.shortName} <br/>
                    ИНН: {organization.orgInn} <br/>
                    КПП: {organization.orgKpp} <br/>
                    ОГРН: {organization.orgOgrn}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {organization.organizationStatus !== 'approved' ? 
                <Button onClick={()=>{setOpen(true), setCancelOrgId(organization.id)}} variant = 'red' customWidth='10px 10px' customFontSize className={'absolute text-xs top-[10px] right-[10px] bg-black'}>
                  Отменить
                </Button> : null
              }
            </CardFooter>
            {organization.organizationStatus == 'approved' ? 
              <Button onClick={()=>{router.push(`./dashboard?=${organization.id}`)}} className={'mx-3'}>Панель управления</Button> : null
            }
          </Card>
        ))}
        <div className='px-5 mt-4'>
          <Button onClick={()=>{setCreateOrg(true)}} fullWidth={true}>Добавить организацию</Button>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogDescription>
                Вы действительно хотите отменить заявку?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className={'bg-red-800 text-white'}>Удалить</AlertDialogAction>
              <AlertDialogCancel>Назад</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      {createOrg ? <TopBar onClick={()=>{setCreateOrg(false)}} title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" hideProfile /> : 
        <TopBar backHref="/select-role" title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" hideProfile />
        }
      {statusAuth || createOrg ?
        <div className="fade-in" style={{ padding: '20px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <form onSubmit={handleSubmit}>
            <h2 className='text-left mb-2 font-bold text-gray-800'>Наименование</h2>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>Полное</span>
              <Textarea type="text"
                id="orgFullName"
                name="orgFullName"
                value={formData.orgFullName}
                onChange={handleChange}
                required/>
            </Label>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px]'}>Краткое</span>
              <Input type="text"
                id="orgShortName"
                name="orgShortName"
                value={formData.orgShortName}
                onChange={handleChange}
                />
            </Label>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>ИНН</span>
              <Input type="number"
                id="orgInn"
                name="orgInn"
                value={formData.orgInn}
                onChange={handleChange}
                required
                />
            </Label>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>КПП</span>
              <Input type="number"
                id="orgKpp"
                name="orgKpp"
                value={formData.orgKpp}
                onChange={handleChange}
                required
                />
            </Label>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>ОГРН</span>
              <Input type="number"
                id="orgOgrn"
                name="orgOgrn"
                value={formData.orgOgrn}
                onChange={handleChange}
                required
                />
            </Label>
            <h2 className='text-left my-2 font-bold text-gray-800'>Контактное лицо</h2>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>ФИО</span>
              <Input type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                />
            </Label>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>Email</span>
              <Input type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                />
            </Label>
            <Label className='flex mb-2'>
              <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>Телефон</span>
              <Input type="number"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                />
            </Label>
            <Label className='flex my-4'>
              <Input type="checkbox"
                className={'w-6'}
                id="checkboxConf"
                name="checkboxConf"
                required
                />
              <span className={'text-left block ml-2'}>Принимаю условия <Link className='underline' href={"#"}>политики конфиденциальности</Link></span>
            </Label>
            <Button type="submit" fullWidth className={'w-[100%]'}>Отправить</Button>
          </form>
        </div> : <div className='text-xl text-center flex column flex-col items-center mt-6'>Для продолжения, вам необходимо авторизоваться <Button onClick={()=>{router.push('/login')}} className='mt-4'>Авторизация</Button></div>
      }
    </div>
  )
}

'use client'

import Button from '@/components/ui/Button'
import TopBar from '@/components/ui/TopBar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/componentsShadCN/ui/accordion'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/componentsShadCN/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/componentsShadCN/ui/card'
import { Field, FieldLabel } from '@/componentsShadCN/ui/field'
import { Input } from '@/componentsShadCN/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/componentsShadCN/ui/input-group'
import { Label } from '@/componentsShadCN/ui/label'
import { RadioGroup, RadioGroupItem } from '@/componentsShadCN/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/componentsShadCN/ui/select'
import { Toaster } from '@/componentsShadCN/ui/sonner'
import { Spinner } from '@/componentsShadCN/ui/spinner'
import { Textarea } from '@/componentsShadCN/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { organizationService } from '@/services/organizationService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function OrgConnectPage() {
  const { userData } = useAuth()
  const router = useRouter()
  const [statusAuth, setStatusAuth] = useState(false)
  const [organizationData, setOrganizationData] = useState([])

  const getOrganizationData = async () => {
    let access_token
    access_token = localStorage.getItem("pioneer_token")

    const response = await fetch('http://localhost:8000/api/organizations/', {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${access_token}`,
        }
    })
    if(response.ok){
      console.log("OK",response)
      setStatusAuth(true)
      const data = await response.json()
      setOrganizationData(data.results)
      console.log("dataOrg", data.results)
    }else if(!response.ok){
      console.log("NOT OK",response)
    }
  }
  useEffect(() => {
    getOrganizationData()
  }, [userData])

  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const [inputErrors, setInputErrors] = useState([])

  const connectCustomer = async (e) => {
    e.preventDefault()
    let errors = {}
    if(formData.orgInn.length !== 12){
      errors.orgInn = "ИНН - 12 символов"
    }
    if(formData.orgOgrn.length !== 15){
      errors.orgOgrn = "ОГРН - 15 символов"
    }
    if(formData.orgKpp.length !== 9){
      errors.orgKpp = "КПП - 9 символов"
    }
    if(formData.contactPhone.length !== 10){
      errors.contactPhone = "Проверьте номер"
    }
    setInputErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }


    let access_token
    access_token = localStorage.getItem("pioneer_token")
    setIsLoading(true)
    console.log(formData.orgInn.length)
    const response = await fetch('http://localhost:8000/api/organizations/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          "name": formData.orgFullName,
          "shortName": formData.orgShortName,
          "organizationType": formData.orgType,
          "organizationStatus": "pending",
          "address": formData.orgAddress,
          "phone": formData.contactPhone,
          "email": formData.contactEmail,
          "description": formData.orgDescr,
          "orgInn": formData.orgInn,
          "orgOgrn": formData.orgOgrn,
          "orgKpp": formData.orgKpp,
          "wheelDiameters": [13, 14, 15, 16, 17, 18, 21, 22, 23, 24],
          "owner": userData.id
        })
    })
    if(response.ok){
      toast("Заявка создана")
      getOrganizationData()
      setIsLoading(false)
      setCreateOrg(false)
    }else if(!response.ok){
      toast("Ошибка сервера")
      setIsLoading(false)
    }
  }

  const [open, setOpen] = useState(false)
  const [cancelOrgId, setCancelOrgId] = useState(null)
  const [createOrg, setCreateOrg] = useState(false)
  useEffect(()=>{
    console.log("cancelOrgId", organizationData)
  }, [cancelOrgId])


  if(organizationData.length !== 0 && !createOrg /* && userData.userOrganizationStatus == 'approved' */){
    return(
      <>
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
          <TopBar backHref="/" title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" />
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
                      Адрес: {organization.orgAddress} <br/>
                      ИНН: {organization.orgInn} <br/>
                      КПП: {organization.orgKpp} <br/>
                      ОГРН: {organization.orgOgrn}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* {organization.organizationStatus !== 'approved' ? 
                  <Button onClick={()=>{setOpen(true), setCancelOrgId(organization.id)}} variant = 'red' customWidth='10px 10px' customFontSize className={'absolute text-xs top-[10px] right-[10px] bg-black'}>
                    Отменить
                  </Button> : null
                } */}
              </CardFooter>
              {organization.organizationStatus == 'approved' ? 
                <Button onClick={()=>{router.push(`./dashboard?=${organization.id}`)}} className={'mx-3'}>Панель управления</Button> : null
              }
            </Card>
          ))}
          <div className='px-5 mt-4'>
            <Button onClick={()=>{setCreateOrg(true)}} fullWidth={true}>Добавить организацию</Button>
          </div>
          {/* <AlertDialog open={open} onOpenChange={setOpen}>
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
          </AlertDialog> */}
        </div>
        <Toaster/>
      </>
    )
  }

  return (
    <>
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
        {createOrg ? <TopBar onClick={()=>{setCreateOrg(false)}} title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" /> : 
          <TopBar backHref="/" title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" />
          }
        {statusAuth || createOrg ?
          <div className="fade-in" style={{ padding: '20px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <form onSubmit={connectCustomer}>
              <h2 className='text-left mb-2 font-bold text-gray-800'>Наименование</h2>
              <Label className='flex mb-2'>
                <span className={'text-sm text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>Полное</span>
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
                <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>Адрес</span>
                <Input type="text"
                  id="orgAddress"
                  name="orgAddress"
                  value={formData.orgAddress}
                  onChange={handleChange}
                  required
                  />
              </Label>
              <Label className='flex mb-2'>
                <span className={'text-left mr-1 w-[88px]'}>Описание</span>
                <Input type="text"
                  id="orgDescr"
                  name="orgDescr"
                  value={formData.orgDescr}
                  onChange={handleChange}
                  placeholder="Мойка и детейлинг"
                  />
              </Label>
              <Label className='flex mb-2'>
                <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>Тип</span>
                <Select
                  name="orgType"
                  value={formData.orgType}
                  onValueChange={(value) => handleChange({
                    target: { name: 'orgType', value }
                  })}
                  required
                >
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="carwash">Мойка / Детейлинг</SelectItem>
                      <SelectItem value="tireshop">Шиномонтаж</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
              <Label className={`flex mb-2 relative ${inputErrors.orgInn ? 'mb-6' : null}`}>
                <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>ИНН</span>
                <Input type="number"
                  id="orgInn"
                  name="orgInn"
                  value={formData.orgInn}
                  onChange={handleChange}
                  className={inputErrors.orgInn ? 'border-red-500 focus:ring-red-500' : ''}
                  required
                  />
                  {inputErrors.orgInn && <span className="text-red-500 text-[11px] absolute bottom-[-1rem] left-[5rem]">{inputErrors.orgInn}</span>}
              </Label>
              <Label className={`flex mb-2 relative ${inputErrors.orgKpp ? 'mb-6' : null}`}>
                <span className={'text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]'}>КПП</span>
                <Input type="number"
                  id="orgKpp"
                  name="orgKpp"
                  value={formData.orgKpp}
                  onChange={handleChange}
                  className={inputErrors.orgKpp ? 'border-red-500 focus:ring-red-500' : ''}
                  required
                  />
                  {inputErrors.orgKpp && <span className="text-red-500 text-[11px] absolute bottom-[-1rem] left-[5rem]">{inputErrors.orgKpp}</span>}
              </Label>
              <Label className={`flex mb-2 relative ${inputErrors.orgOgrn ? 'mb-6' : null}`}>
                <span className={`text-left mr-2 w-[88px] after:ml-0.5 after:text-red-500 after:content-["*"]`}>ОГРН</span>
                <Input type="number"
                  id="orgOgrn"
                  name="orgOgrn"
                  value={formData.orgOgrn}
                  className={inputErrors.orgOgrn ? 'border-red-500 focus:ring-red-500' : ''}
                  onChange={handleChange}
                  required
                  />
                  {inputErrors.orgOgrn && <span className="text-red-500 text-[11px] absolute bottom-[-1rem] left-[5rem]">{inputErrors.orgOgrn}</span>}
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
                <div className='relative'>
                  <Input type="number"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  className={`pl-7 ${inputErrors.orgOgrn ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <span className='absolute font-bold text-base left-1 top-[50%] translate-y-[-50%]'>+7</span>
                  {inputErrors.contactPhone && <span className="text-red-500 text-[11px] absolute bottom-[-1rem] left-0">{inputErrors.contactPhone}</span>}
                </div>
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
        {isLoading ? 
          <div className='w-full h-full fixed top-0 left-0 bg-black/50'>
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
              <Spinner className="size-14 text-white" />
            </div>
          </div> : null}
      </div>
      <Toaster/>
    </>
  )
}

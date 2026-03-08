'use client'

import Button from '@/components/ui/Button'
import TopBar from '@/components/ui/TopBar'
import { Input } from '@/componentsShadCN/ui/input'
import { Label } from '@/componentsShadCN/ui/label'
import { Textarea } from '@/componentsShadCN/ui/textarea'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OrgConnectPage() {
  const router = useRouter()
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [statusAuth, setStatusAuth] = useState(false)

  useEffect(() => {
    let value
    value = localStorage.getItem("pioneer_token")
    setLoadingStatus(false)
    if(value !== null){
      setStatusAuth(true)
    }
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

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

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <TopBar backHref="/select-role" title="ОРГАНИЗАЦИЯМ-ПАРТНЁРАМ" />
      {loadingStatus == true ?
        <span>Загрузка</span> :
        loadingStatus == false && statusAuth == true ?
        <div className="fade-in" style={{ padding: '20px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <form onSubmit={handleSubmit}>
            <h2 className='text-left mb-2 font-bold text-gray-800'>Наименование</h2>
            <div className='flex mb-2'>
              <Label htmlFor='orgFullName' className={'mr-2'}>Полное</Label>
              <Textarea type="text"
                id="orgFullName"
                name="name"
                value={formData.orgFullName}
                onChange={handleChange}
                required/>
            </div>
            <div className='flex mb-2'>
              <Label htmlFor='orgCropName' className={'mr-2'}>Краткое</Label>
              <Input type="text"
                id="orgCropName"
                name="orgCropName"
                value={formData.orgCropName}
                onChange={handleChange}
                />
            </div>
            <div className='flex mb-2'>
              <Label htmlFor='orgInn' className={'mr-2'}>ИНН</Label>
              <Input type="number"
                id="orgInn"
                value={formData.orgInn}
                onChange={handleChange}
                />
            </div>
            <div className='flex mb-2'>
              <Label htmlFor='orgKpp' className={'mr-2'}>КПП</Label>
              <Input type="number"
                id="orgKpp"
                name="orgKpp"
                value={formData.orgKpp}
                onChange={handleChange}
                />
            </div>
            <div className='flex mb-2'>
              <Label className={'mr-2'}>ОГРН</Label>
              <Input type="number"
                id="orgOgrn"
                name="orgOgrn"
                value={formData.orgOgrn}
                onChange={handleChange}
                />
            </div>
            <h2 className='text-left my-2 font-bold text-gray-800'>Контактное лицо</h2>
          </form>
        </div> : <div className='text-xl text-center flex column flex-col items-center mt-6'>Для продолжения, вам необходимо авторизоваться <Button onClick={()=>{router.push('/login')}} className='mt-4'>Авторизация</Button></div>
      }
    </div>
  )
}

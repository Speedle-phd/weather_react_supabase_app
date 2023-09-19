import {  useRef } from 'react'
import blueClouds from '../assets/blue_clouds.jpg'
import { supabase, useDatabaseContext } from '../context/DataBaseContextProvider'
import { randomUUID } from 'crypto'

const ChangeAvatar = () => {
   const db = useDatabaseContext()
   const formRef = useRef<HTMLFormElement | null>(null)

   const handleChange = async() => {
      const formData = new FormData(formRef.current!)
      const newAvatar = formData.get('avatar')
      if (!newAvatar) return
      try {
         
         
         const {data, error} = await supabase.storage.from('avatars').upload(`avatar_${db!.user!.email!}_${Date.now()}.png`, newAvatar, {upsert: true})
         if (error) return console.log(error)
         console.log(data)
         const { data: updateUserData, error: updateUserError } =
            await supabase.auth.updateUser({
               data: {
                  avatar: `https://pubbsysucrloxsdbglwj.supabase.co/storage/v1/object/public/avatars/${
                     data?.path
                  }`,
               },
            })
            if (updateUserError) return console.log(updateUserError)
            console.log(updateUserData)
         db?.changeAvatar(
            `https://pubbsysucrloxsdbglwj.supabase.co/storage/v1/object/public/avatars/${data?.path}`
         )
         
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <div
         style={{ backgroundImage: `url(${blueClouds})` }}
         className='h-full bg-cover bg-center p-3 flex justify-center items-center'
      >
         <div className='flex flex-col justify-center items-center bg-[rgba(255,255,255,0.3)] rounded-lg w-full py-3 border-4 backdrop-blur-sm relative'>
            <h4 className='mb-5'>Change Avatar</h4>
            <form ref={formRef} className='flex flex-col justify-center items-center'>
               <label
                  style={{ backgroundImage: `url(${db!.avatar!})` }}
                  className='w-24 h-24 rounded-full bg-center bg-cover cursor-pointer hover:border-4 focus-visible:border-4'
                  htmlFor='avatar'
                  tabIndex={0}
               ></label>
               <input
                  className='hidden'
                  type='file'
                  name='avatar'
                  id='avatar'
                  onChange={() => void handleChange()}
               />
            </form>
         </div>
      </div>
   )
}

export default ChangeAvatar

import { useRef, useState } from 'react'
import blueClouds from '../assets/blue_clouds.jpg'
import {
   supabase,
   useDatabaseContext,
} from '../context/DataBaseContextProvider'
import loadingMoon from '../assets/moon.png'

const ChangeAvatar = () => {
   const db = useDatabaseContext()
   const formRef = useRef<HTMLFormElement | null>(null)
   const [loading, setLoading] = useState(false)
   const handleChange = async () => {
      setLoading(true)
      const formData = new FormData(formRef.current!)
      const newAvatar = formData.get('avatar')
      if (!newAvatar) return
      try {
         if (!db?.avatar?.includes('placeholder')) {
            await supabase.storage
               .from('avatars')
               .remove([db!.avatar!.split('avatars/')[1]])
         }
         const { data, error } = await supabase.storage
            .from('avatars')
            .upload(`avatar_${db!.user!.email!}_${Date.now()}.png`, newAvatar, {
               upsert: true,
            })
         if (error) {
            console.log(error)
            return
         }
         const { error: updateUserError } = await supabase.auth.updateUser({
            data: {
               avatar: `https://pubbsysucrloxsdbglwj.supabase.co/storage/v1/object/public/avatars/${data?.path}`,
            },
         })
         if (updateUserError) {
            console.log(updateUserError)
            return
         }

         db?.changeAvatar(
            `https://pubbsysucrloxsdbglwj.supabase.co/storage/v1/object/public/avatars/${data?.path}`
         )

         // setPreview(URL.createObjectURL(newAvatar as MediaSource | Blob))
         // dialogRef.current!.showModal()
      } catch (error) {
         console.log(error)
         
      } finally {
   setLoading(false)
      }
   }
   return (
      <div
         style={{ backgroundImage: `url(${blueClouds})` }}
         className='h-full bg-cover bg-center p-3 flex justify-center items-center'
      >
         <div className='flex flex-col justify-center items-center bg-[rgba(255,255,255,0.3)] rounded-lg w-full py-3 border-4 backdrop-blur-sm relative'>
            <h4 className='mb-5'>Change Avatar</h4>
            <form
               ref={formRef}
               className='flex flex-col justify-center items-center'
            >
               {loading ? (
                  <img className="loading-moon w-24 aspect-square" src={loadingMoon} alt="loading"/>
               ) : (
                  <>
                     <label
                        style={{
                           backgroundImage: `url(${db!.avatar!})`,
                        }}
                        className='w-24 h-24 rounded-full bg-cover bg-center cursor-pointer hover:border-4 focus-visible:border-4'
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
                  </>
               )}
            </form>
         </div>
      </div>
   )
}

export default ChangeAvatar

{
   /* <dialog
               ref={dialogRef}
               className='backdrop:bg-black/60 bg-stone-100 rounded-sm p-0 overflow-hidden'
            >
               <div className='p-2 md:p-10 bg-black/80 '>
                  <SetPositionAvatar preview={preview!} />
                  <div className='mt-5 flex items-align justify-around'>
                     <button className='px-3 py-2 rounded-lg text-white bg-teal-900 hover:bg-teal-700 focus-visible:bg-teal-700 transition-colors'>
                        Accept Position
                     </button>
                     <button
                        onClick={closeModal}
                        className='px-3 py-2 rounded-lg text-white bg-rose-900 hover:bg-rose-700 focus-visible:bg-rose-700 transition-colors'
                     >
                        Use default
                     </button>
                  </div>
               </div>
            </dialog> */
}

import { createRef, useEffect, useRef, useState } from 'react'
import blueClouds from '../assets/blue_clouds.jpg'
import {
   supabase,
   useDatabaseContext,
} from '../context/DataBaseContextProvider'
import loadingMoon from '../assets/moon.png'
import { ReactCropperElement, Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import React from 'react'

const ChangeAvatar = () => {
   const db = useDatabaseContext()
   const dialogRef = useRef<HTMLDialogElement | null>(null)
   const formRef = useRef<HTMLFormElement | null>(null)
   const [loading, setLoading] = useState(false)
   const [uploaded, setUploaded] = useState(null as string | null)
   const cropperRef = createRef<ReactCropperElement>()

   const updateAvatar = async (croppedData: File) => {
      try {
         if (!db?.avatar?.includes('placeholder')) {
            await supabase.storage
               .from('avatars')
               .remove([db!.avatar!.split('avatars/')[1]])
         }
         const { data, error } = await supabase.storage
            .from('avatars')
            .upload(
               `avatar_${db!.user!.email!}_${Date.now()}.png`,
               croppedData,
               {
                  upsert: true,
               }
            )
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
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
         dialogRef.current!.close()
      }
   }

   const handleChange = () => {
      setLoading(true)
      const formData = new FormData(formRef.current!)
      const newAvatar = formData.get('avatar') as File
      if (!newAvatar) return
      setUploaded(URL.createObjectURL(newAvatar))
      dialogRef.current!.showModal()
   }

   const handleCrop = (e: React.MouseEvent) => {
      e.preventDefault()
      const imageElement = cropperRef.current!
      const cropper = imageElement?.cropper
      const canvas = cropper.getCroppedCanvas()
      canvas.toBlob((blob) => {
         const fd = new FormData()
         fd.append('croppedImage', blob!)
         updateAvatar(fd.get('croppedImage') as File).finally(() => console.log())
      })
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
               <dialog ref={dialogRef} className="backdrop:bg-black/80 bg-stone-800" >
                  <div className="flex flex-col gap-4">
                     <Cropper
                        src={uploaded!}
                        // style={{ height: 500, width: 500 }}
                        className="w-[80vw] mx-auto"
                        autoCropArea={1}
                        aspectRatio={1}
                        viewMode={3}
                        guides={false}
                        ref={cropperRef}
                     />
                        <div className="flex justify-center gap-4">
                           <button className="bg-teal-600 px-2 py-1 rounded-sm" onClick={(e: React.MouseEvent) => void handleCrop(e)}>
                              Crop
                           </button>
                           <button className="bg-red-800 px-2 py-1 rounded-sm" onClick={(e: React.MouseEvent) => {
                              e.preventDefault()
                              setUploaded(null)
                              dialogRef.current!.close()
                              setLoading(false)
                              }}>
                              Cancel
                           </button>
                        </div>
                  </div>
                  
               </dialog>
               {loading ? (
                  <img
                     className='loading-moon w-24 aspect-square'
                     src={loadingMoon}
                     alt='loading'
                  />
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


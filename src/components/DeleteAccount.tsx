import { useRef, useState } from 'react'
import redCrimson from '../assets/red-crimson.jpg'
import { useDatabaseContext } from '../context/DataBaseContextProvider'

interface DeleteAccountProps {
   email: string
   userId: string
}

const DeleteAccount = ({ email, userId }: DeleteAccountProps) => {
   const db = useDatabaseContext()
   const formRef = useRef<HTMLFormElement|null>(null)
   const dialogRef = useRef<HTMLDialogElement | null>(null)
   const openModal = () => {
      dialogRef.current!.showModal()
   }
   const closeModal = () => {
      dialogRef.current!.close()
   }
   const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(formRef.current!)
      const emailInput = formData.get('email') as string
      if (emailInput.toLowerCase() !== email.toLowerCase()) return

      await db?.deleteUser(userId).catch((err) => console.log(err))
   }

   return (
      <div
         style={{ backgroundImage: `url(${redCrimson})` }}
         className='h-full bg-cover bg-center p-3 flex justify-center items-center'
      >
         <div className='flex flex-col justify-center items-center bg-[rgba(255,255,255,0.3)] rounded-lg w-full py-3'>
            <h4 className='text-center text-red-950'>DANGER ZONE</h4>
            <p className='text-sm text-center text-black my-5'>
               Clicking here might lead to a destructive action.
            </p>
            <button
               onClick={openModal}
               className='border-4 border-red-900 rounded-md px-2 py-1 bg-slate-50/30 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50'
            >
               Delete account
            </button>
         </div>

         <dialog
            ref={dialogRef}
            className='backdrop:bg-black/60 bg-stone-100 rounded-lg p-0 overflow-hidden'
         >
            <div className='content-container p-8 relative flex justify-center items-center flex-col after:inset-[4px] after:rounded-lg after:border-2 after:border-red-950 after:absolute after:z-[-1]'>
               <h5 className='text-red-950 underline underline-offset-3 text-2xl font-extrabold'>
                  Delete your account
               </h5>
               <p className='my-2'>
                  In order to delete your account <br />
                  type <span className='text-rose-900'>'{email}'</span>
                  <br />
                  and confirm:
               </p>
               <form
                  autoComplete='off'
                  ref={formRef}
                  onSubmit={(e: React.FormEvent) => void handleSubmit(e)}
                  className='flex flex-col justify-center'
               >
                  <input
                     required
                     className='rounded-lg p-2 invalid:border-rose-900 valid:border-teal-400 border-4 focus-within:outline-none focus-within:border-teal-100'
                     placeholder='Type your email here...'
                     type='email'
                     name='email'
                     id='email'
                  />
                  <div className='mt-3 btn-container flex justify-around'>
                     <button
                        className='bg-red-950 text-white px-4 py-2 rounded-lg hover:bg-red-800 focus-visible:bg-red-800 transition-colors'
                        type='submit'
                     >
                        Delete
                     </button>
                     <button
                        className='px-4 py-2 bg-slate-400 rounded-lg text-white hover:bg-slate-600 focus-visible:bg-slate-600 transition-colors'
                        onClick={closeModal}
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </div>
         </dialog>
      </div>
   )
}

export default DeleteAccount

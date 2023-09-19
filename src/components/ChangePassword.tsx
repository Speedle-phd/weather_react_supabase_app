import { useNavigation } from 'react-router-dom'
import yellowClouds from '../assets/yellow_clouds.jpg'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../context/DataBaseContextProvider'

const ChangePassword = () => {
   const [match, setMatch] = useState({match: false, message: "", alert: false})
   const navigation = useNavigation()
   const formRef = useRef<HTMLFormElement | null>(null)
   
   const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(formRef.current!)
      const newPassword = formData.get('new-password') as string
      const confirmPassword = formData.get('confirm-password') as string
      console.log(confirmPassword, newPassword)
      if (newPassword !== confirmPassword) {
         return setMatch((prev) => {
            return {...prev, message: "Confirmation Password doesn't match with your new password. Please try again.", alert: true}
         })
      } else {
         try {
            const {data, error} = await supabase.auth.updateUser({
               password: newPassword,
            })
            if (error) {
               console.log(error)
            } else {
               formRef.current!.reset()
            }
         } catch (error) {
            console.log(error)
         }
      }
   }

   useEffect(() => {
      const myTimeout = setTimeout(() => {
         setMatch((prev) => {
            return {...prev, message: "", alert: false}
         })
      }, 2000)
      return () => clearTimeout(myTimeout)
   })

   return (
      <div
         style={{ backgroundImage: `url(${yellowClouds})` }}
         className='h-full bg-cover bg-center p-3 flex justify-center items-center'
      >
         <div className='flex flex-col justify-center items-center bg-[rgba(255,255,255,0.3)] rounded-lg w-full py-3 border-4 backdrop-blur-sm relative'>
            {match.alert ? 
            <div className="absolute top-0 left-1/2 translate-x-[-50%] bg-red-800 px-3 py-2 rounded-lg font-medium text-sm text-white/80 border-4 border-red-900 w-full">{match.message}</div>
            : null}
            <h4>Change Password</h4>
            <form
               ref={formRef}
               onSubmit={(e: React.FormEvent) => void handleSubmit(e)}
               className='p-4 grid gap-2 w-[100%]'
            >
               <input
                  className='rounded-lg w-[100%] px-4 py-2 text-sm'
                  autoComplete='off'
                  type='password'
                  placeholder='Type new password...'
                  required
                  id='new-password'
                  name='new-password'
                  minLength={6}
               />
               <input
                  className='rounded-lg w-[100%] px-4 py-2 text-sm'
                  autoComplete='off'
                  type='password'
                  placeholder='Confirm password...'
                  required
                  id='confirm-password'
                  name='confirm-password'
                  minLength={6}
               />
               <button
                  className='border-4 border-yellow-800 rounded-lg text-black/70 bg-yellow-600 text-sm py-1 hover:bg-yellow-700/80 focus-visible:bg-yellow-700/80'
                  type='submit'
                  disabled={navigation.state === 'loading'}
               >
                  {navigation.state === 'loading'
                     ? 'Loading...'
                     : 'Save Changes'}
               </button>
            </form>
         </div>
      </div>
   )
}

export default ChangePassword

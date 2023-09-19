import { useRef } from 'react'
import background from '../assets/red-clouds.jpg'
import { supabase, useDatabaseContext } from '../context/DataBaseContextProvider'
import { useNavigation } from 'react-router-dom'

const ChangeUsername = () => {
   const db = useDatabaseContext()
   const navigation = useNavigation()
   const formRef = useRef<HTMLFormElement | null>(null)
   const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(formRef.current!)
      const newUsername = formData.get('new-username')
      try {
         const {data, error} = await supabase.auth.updateUser({data: {username: newUsername}})
         if (error) {
            console.log(error)
         } else {
            const username = data.user.user_metadata.username as string
            db?.changeUsername(username)
            formRef.current!.reset()
         }
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <div
         style={{ backgroundImage: `url(${background})` }}
         className='h-full bg-cover bg-center p-3 flex justify-center items-center'
      >
         <div className='flex flex-col justify-center items-center bg-[rgba(255,255,255,0.7)] rounded-lg w-full py-3 border-4 backdrop-blur-sm'>
            <h4>Change Username</h4>
            <form ref={formRef} onSubmit={(e: React.FormEvent) => void handleSubmit(e)} className='p-4 grid gap-2 w-[100%]'>
               <input
                  className='rounded-lg w-[100%] px-4 py-2 text-sm'
                  autoComplete='username'
                  type='text'
                  placeholder='Type new username...'
                  required
                  id="new-username"
                  name="new-username"
               />
               <button
                  className='border-4 border-slate-800 rounded-lg text-white bg-slate-600 text-sm py-1 hover:bg-slate-700/80 focus-visible:bg-slate-700/80'
                  type='submit'
                  disabled={navigation.state === "loading"}
               >
                  {navigation.state === 'loading' ? "Loading..." : "Save Changes"}
               </button>
            </form>
         </div>
      </div>
   )
}

export default ChangeUsername

import { Form, useNavigate } from "react-router-dom"
import LoginFormControl from "../components/LoginFormControl"
import { useRef } from "react"
import Underline from "../components/Underline"
import { supabase } from "../context/DataBaseContextProvider"

const Reset = () => {
   const navigate = useNavigate()
   const formRef = useRef<HTMLFormElement | null>(null)
   const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(formRef.current!)
      const email = formData.get('email') as string
      try {
         const {data, error} = await supabase.auth.resetPasswordForEmail(email)
         if (error) {
            return console.log(error)
         } 
         if (data) {
            navigate('/restoring_password')
         }
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <div className='flex flex-col justify-center items-center mt-14 text-lg font-bold'>
         <div>
            <h2 className='text-2xl'>Reset your Password</h2>
            <Underline />
         </div>
         <Form
            ref={formRef}
            onSubmit={(e: React.FormEvent) => void handleSubmit(e)}
            className='valid:shadow-whiteShadow focus-within:shadow-none my-8 text-center w-[clamp(20rem,50vw,50rem)] flex flex-col gap-8 bg-[rgba(33,33,33,.45)] p-10 rounded-md transition-all'
            method='POST'
         >
            <LoginFormControl type={'email'} />
            <button
               className='bg-slate-800/80 px-2 py-1 rounded-lg mx-auto w-[10rem] hover:bg-slate-900 focus-visible:bg-slate-600 transition-colors'
               type='submit'
            >
               Submit
            </button>
         </Form>
      </div>
   )
}

export default Reset

import { Form, Link, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import LoginFormControl from './LoginFormControl'
import { useDatabaseContext } from '../context/DataBaseContextProvider'
import {  useRef } from 'react'


const LoginForm = () => {
   const db = useDatabaseContext()
   const formRef = useRef<HTMLFormElement>(null)
   const location = useLocation()
   const path = location.pathname.replace('/', '')
   const navigate = useNavigate()
   const navigation = useNavigation()


   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const fd = new FormData(formRef.current!)
      const email = fd.get('email') as string
      const password = fd.get('password') as string
      if (path === 'login') {
         db?.loginFn(email, password).catch((err) => console.log(err)).finally(() => navigate("/"))
      } else if (path === 'signup') {
         const username = fd.get('username') as string
         db?.signUpFn(email, password, username).catch((err) => console.log(err)).finally(() => navigate("/"))
      }
   }

   return (
      <>
         <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className='valid:shadow-whiteShadow focus-within:shadow-none my-8 text-center w-[clamp(20rem,50vw,50rem)] flex flex-col gap-8 bg-[rgba(33,33,33,.45)] p-10 rounded-md transition-all'
            method='POST'
         >
            {path === 'signup' ? <LoginFormControl type={'username'} /> : null}
            <LoginFormControl type={'email'} />
            <LoginFormControl type={'password'} />
            <button className='btn-blue px-10 self-center'>
               {navigation.state === 'idle'
                  ? path === 'login'
                     ? 'Login'
                     : 'Signup'
                  : path === 'login'
                  ? 'Loggin\' in'
                  : 'Signin\' up'}
            </button>

            {path === 'login' ? (
               <>
                  <div className='flex flex-col gap-3'>
                     Do not have an account?
                     <br />
                     <Link
                        className='uppercase hover:text-slate-600 text-cyan-800 transition-colors'
                        to='/signup'
                     >
                        Create one lightning fast
                     </Link>
                  </div>
                  <Link to="/reset"><button className="bg-stone-600 text-white/80 px-3 py-1 rounded-lg hover:bg-stone-800 focus-visible:bg-stone-800 transition-colors">Forgot Password?</button></Link>
               </>
            ) : (
               <>
                  <div className='flex flex-col gap-3'>
                     Already have an account?
                     <br />
                     <Link
                        className='uppercase hover:text-slate-600 text-cyan-800 transition-colors'
                        to='/login'
                     >
                        Log in lightning fast
                     </Link>
                  </div>
               </>
            )}
         </Form>
      </>
   )
}

export default LoginForm

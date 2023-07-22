import LoginForm from '../components/LoginForm'

const Login = () => {
   return (
      <div className='flex flex-col justify-center items-center mt-14 text-lg font-bold'>
         <h2 className='text-2xl'>Storm into your account</h2>
         <div
            className='bg-slate-400 h-[8px] w-20 rounded-md mt-4'
            style={{ boxShadow: '0 0px 25px 2px rgba(255,255,255,0.6' }}
         ></div>
         <LoginForm />
      </div>
   )
}

export default Login

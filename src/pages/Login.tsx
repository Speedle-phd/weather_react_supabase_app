import LoginForm from '../components/LoginForm'
import Underline from '../components/Underline'

const Login = () => {
   return (
      <div className='flex flex-col justify-center items-center mt-14 text-lg font-bold'>
         <h2 className='text-2xl'>Storm into your account</h2>
         <Underline />
         <LoginForm />
      </div>
   )
}

export default Login

import LoginForm from '../components/LoginForm'
import Underline from '../components/Underline'

const Login = () => {
   return (
      <div className='flex flex-col justify-center items-center mt-14 text-lg font-bold'>
         <div>
            <h2 className='text-2xl'>Storm into your account</h2>
            <Underline />
         </div>
         <LoginForm />
      </div>
   )
}

export default Login

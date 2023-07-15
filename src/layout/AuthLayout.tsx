import { Outlet } from 'react-router-dom'
import LoginCard from '../components/LoginCard'

const AuthLayout = () => {
   return (
      <div className='min-h-[100dvh]'>
         <LoginCard>
            <LoginCard.Above>
               <div className='m-auto mt-10 bg-[rgba(255,255,255,0.07)] text-2xl w-72 h-32 text-center pt-10 rounded-sm backdrop-blur-[3px]'>
                  <h3 className='text-slate-700 mb-2 font-bold'>Weather the weather</h3>
                  <p className='text-base'>Brace yourself</p>
               </div>
            </LoginCard.Above>
            <LoginCard.Body>
               <Outlet />
            </LoginCard.Body>
            <LoginCard.Below>
               <h3>&copy; Weather_the_weather {new Date().getFullYear()}</h3>
            </LoginCard.Below>
         </LoginCard>
      </div>
   )
}



export default AuthLayout

import { Outlet } from 'react-router-dom'
import LoginCard from '../components/LoginCard'
import { useDatabaseContext } from '../context/DataBaseContextProvider'


const AuthLayout = () => {
   const db = useDatabaseContext()
   const handleLogout = () => {
      db?.logoutFn().catch(err => console.log(err))
   }
   return (
      <>
         
            <div className='min-h-[100dvh] bg-cyan-900/10'>
               <LoginCard>
                  <LoginCard.Above>
                     <div className='backdrop-saturate-50 m-auto mt-10 bg-[rgba(255,255,255,0.07)] text-2xl w-80 min-h-[min-content] text-center p-12 rounded-sm backdrop-blur-[3px]'>
                        <h3
                           style={{ textShadow: '0 1px 4px #fff' }}
                           className='text-slate-700 mb-2 font-bold'
                        >
                           Weather the weather
                        </h3>
                        <p className='text-base'>Brace yourself</p>
                     </div>
                  </LoginCard.Above>
                  <LoginCard.Body>
                     <Outlet />
                  </LoginCard.Body>
                  <LoginCard.Below>
                     <h3 onClick={handleLogout}>
                        &copy; Weather_the_weather {new Date().getFullYear()}
                     </h3>
                  </LoginCard.Below>
               </LoginCard>
            </div>
         
      </>
   )
   }
   




export default AuthLayout

import { Navigate, Outlet } from 'react-router-dom'
import { useDatabaseContext } from '../context/DataBaseContextProvider'
import darkClouds from '../assets/dark-clouds.jpg'
import ControlButton from '../components/ControlButton'
import { useEffect, useRef } from 'react'

const RootLayout = () => {
   const db = useDatabaseContext()
   const logoutRef = useRef<HTMLButtonElement | null>(null)

   useEffect(() => {
      db?.getCurrentSession().catch((err) => console.log(err))
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])


   return (
      <>
         {db?.user ? (
            <div className='' style={{ backgroundImage: `url(${darkClouds})` }}>
               <aside className='fixed top-1 right-1 text-slate-300/80 '>
                  <nav>
                     <ControlButton>Weatherdetails</ControlButton>
                     <ControlButton>Administer Location</ControlButton>
                     <ControlButton>Accountsettings</ControlButton>
                     <ControlButton
                        ref={logoutRef}
                        onClick={() => {
                           void db?.logoutFn()
                        }}
                     >
                        Logout
                     </ControlButton>
                  </nav>
               </aside>
               <Outlet />
               <aside className='fixed bottom-2 right-2 text-slate-300/80'>
                  &copy; Weather_the_weather {new Date().getFullYear()}
               </aside>
            </div>
         ) : (
            <Navigate to='/login'></Navigate>
         )}
      </>
   )
}

export default RootLayout

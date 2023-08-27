import { Navigate, Outlet, useLoaderData } from 'react-router-dom'
import { useDatabaseContext } from '../context/DataBaseContextProvider'
import darkClouds from '../assets/dark-clouds.jpg'
import ControlButton from '../components/ControlButton'
import { useEffect, useRef } from 'react'
import useResize from '../hooks/useResize'
import {AiOutlineLogout} from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'
import { BsFillCloudLightningRainFill, BsPinMapFill } from 'react-icons/bs'

const RootLayout = () => {
   const db = useDatabaseContext()
   const logoutRef = useRef<HTMLButtonElement | null>(null)
   const [windowSize, setSize] = useResize()

   useEffect(() => {
      window.addEventListener("resize", setSize)
      return () => window.removeEventListener("resize", setSize)
   },[setSize, windowSize])

// TODO: tooltips for buttons
   return (
      <>
         {db?.user ? (
            <div className='' style={{ backgroundImage: `url(${darkClouds})`, backgroundSize: "cover" }}>
               <aside className='flex justify-end p-3 text-slate-300/80 '>
                  <nav className='flex gap-1'>
                     <ControlButton>
                        {' '}
                        {windowSize < 768 ? (
                           <BsFillCloudLightningRainFill aria-label='Weatherdetails' />
                        ) : (
                           'Weatherdetails'
                        )}
                     </ControlButton>
                     <ControlButton>
                        {' '}
                        {windowSize < 768 ? (
                           <BsPinMapFill aria-label='Administer Locations' />
                        ) : (
                           'Locations'
                        )}
                     </ControlButton>
                     <ControlButton>
                        {' '}
                        {windowSize < 768 ? (
                           <FiSettings aria-label='Accountsettings' />
                        ) : (
                           'Settings'
                        )}
                     </ControlButton>
                     <ControlButton
                        ref={logoutRef}
                        onClick={() => {
                           void db?.logoutFn()
                        }}
                     >
                        {windowSize < 768 ? (
                           <AiOutlineLogout aria-label='Logout' />
                        ) : (
                           'Logout'
                        )}
                     </ControlButton>
                     {/* //TODO: Make a component */}
                     <aside className="text-md md:text-xl md:p-5 text-slate-900 font-bold p-3 bg-slate-50/70 backdrop-blur-lg rounded-xl absolute left-2">{`Welcome ${db.user.user_metadata.username as string}`}</aside>
                  </nav>
               </aside>
               <Outlet />
               <aside className='text-right p-3 text-slate-300/50'>
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

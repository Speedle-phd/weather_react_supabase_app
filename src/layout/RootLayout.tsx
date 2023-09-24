import {  NavLink, Navigate, Outlet } from 'react-router-dom'
import { useDatabaseContext } from '../context/DataBaseContextProvider'
import darkClouds from '../assets/dark-clouds.jpg'
import redCrimson from '../assets/red-crimson2.jpg'
import ControlButton from '../components/ControlButton'
import { useEffect, useRef, useState } from 'react'
import useResize from '../hooks/useResize'
import { AiOutlineHome, AiOutlineLogout } from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'
import { BsFillCloudLightningRainFill, BsPinMapFill } from 'react-icons/bs'
import useTime from '../hooks/useTime'

const RootLayout = () => {
   const db = useDatabaseContext()
   const logoutRef = useRef<HTMLButtonElement | null>(null)
   const [windowSize, setSize] = useResize()
   const [time] = useTime(new Date())
   const [backgroundImage, setBackgroundImage] = useState<string>()

   useEffect(() => {
      if (+time < 13) {
         setBackgroundImage(darkClouds)
      } else {
         setBackgroundImage(redCrimson)
      }
   }, [time])

   

   useEffect(() => {
      window.addEventListener('resize', setSize)
      return () => window.removeEventListener('resize', setSize)
   }, [setSize, windowSize])

   // TODO: tooltips for buttons
   return (
      <>
         {db?.user ? (
            <div
               className='cloud-animation bg-3000 bg-repeat md:bg-cover md:bg-no-repeat  overflow-hidden'
               style={{
                  backgroundImage: `url(${backgroundImage!})`,
                  backgroundPosition: 'center',
               }}
            >
               <aside className='flex justify-end p-3 text-slate-300/80 '>
                  <nav className='flex gap-1'>
                     <NavLink
                        className={({ isActive }) => (isActive ? 'hidden' : '')}
                        to='/'
                     >
                        <ControlButton>
                           {' '}
                           {windowSize < 768 ? (
                              <AiOutlineHome aria-label='Home' />
                           ) : (
                              'Home'
                           )}
                        </ControlButton>
                     </NavLink>
                     <NavLink
                        className={({ isActive }) => (isActive ? 'hidden' : '')}
                        to='/details'
                     >
                        <ControlButton>
                           {' '}
                           {windowSize < 768 ? (
                              <BsFillCloudLightningRainFill aria-label='Weatherdetails' />
                           ) : (
                              'Weatherdetails'
                           )}
                        </ControlButton>
                     </NavLink>
                     <NavLink
                        className={({ isActive }) => (isActive ? 'hidden' : '')}
                        to='/locations'
                     >
                        <ControlButton>
                           {' '}
                           {windowSize < 768 ? (
                              <BsPinMapFill aria-label='Administer Locations' />
                           ) : (
                              'Locations'
                           )}
                        </ControlButton>
                     </NavLink>
                     <NavLink
                        className={({ isActive }) => (isActive ? 'hidden' : '')}
                        to='/settings'
                     >
                        <ControlButton>
                           {' '}
                           {windowSize < 768 ? (
                              <FiSettings aria-label='Accountsettings' />
                           ) : (
                              'Settings'
                           )}
                        </ControlButton>
                     </NavLink>
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
                     <aside className='text-sm md:text-xl md:px-5 text-slate-900 font-bold px-3 py-2 gap-3 bg-slate-50/70 backdrop-blur-lg rounded-xl absolute left-2 flex flex-col sm:flex-row items-center'><span>
                        <span className="hidden md:inline-block">Welcome </span>
                        {` ${
                           db.username as string
                        }`}
                     </span>
                     

                     <img className="rounded-full w-8 h-8 md:w-12 md:h-12 object-cover object-center" src={db.avatar!} alt="Avatar" /></aside>
                  </nav>
               </aside>
               <main className='my-5 gap-4 min-h-[100dvh] font-thick text-lg font-bold flex flex-col items-center  w-[max(20rem,_calc(100vw_-_4rem))] mx-auto '>
                  <Outlet />
               </main>
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

import { useLoaderData } from 'react-router-dom'
import { useDatabaseContext } from './context/DataBaseContextProvider'
import { useWeatherContext } from './context/WeatherContextProvider'
import Underline from './components/Underline'
import Clock from './components/Clock'
import { useEffect } from 'react'


const App = () => {
   const contextData = useWeatherContext()
   // const db = useDatabaseContext()
   const loaderData = useLoaderData()
   // const { current: { dt }, timezone_offset} = loaderData
   console.log(loaderData)


   return (
      <>
         <main className='gap-4 font-thick text-lg font-bold flex flex-col justify-center items-center min-h-[100dvh] w-[max(20rem,_calc(100vw_-_4rem))] mx-auto'>
            <section className="p-20 min-h-[80dvh] w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-1]">
               <h1 className="text-center text-3xl text-slate-800">Weather App</h1>
               <Underline/>
               <Clock/>
            </section>
         </main>
      </>
   )
}

export default App

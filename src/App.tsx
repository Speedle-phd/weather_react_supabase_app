import { Await, Link, useLoaderData } from 'react-router-dom'
// import { useDatabaseContext } from './context/DataBaseContextProvider'
// import { useWeatherContext } from './context/WeatherContextProvider'
import Underline from './components/Underline'
import Clock from './components/Clock'
import { Suspense } from 'react'
import { WiHumidity } from 'react-icons/wi'
import WeatherIconValuePair from './components/WeatherIconValuePair'
import { FiSunrise, FiSunset } from 'react-icons/fi'
import { LiaGrinBeamSweatSolid, LiaTemperatureHighSolid } from 'react-icons/lia'
import { BsFillCloudHazeFill } from 'react-icons/bs'
import Loading from './components/Loading'

export interface WeatherDataInterface {
   dt: number
   humidity: number
   sunrise: number
   sunset: number
   clouds: number
   rain?: number
   snow?: number
   weather: [
      {
         description: string
         icon: string
         main: string
      }
   ]
}

export interface HourlyWeatherDataInterface extends WeatherDataInterface {
   feels_like: number,
   temp: number
   pop: number 
}
export interface CurrentWeatherDataInterface extends WeatherDataInterface {
   feels_like: number,
   temp: number
}

interface AppDataInterface {
   deferredData: {
      username: string
      avatar: string
      name: string
      state: string
      country: string
      timezone_offset: number
      current: CurrentWeatherDataInterface 
   }
}

const App = () => {
   // const contextData = useWeatherContext()
   // const db = useDatabaseContext()
   const loaderData = useLoaderData()

   const renderContent = ({ deferredData }: AppDataInterface) => {
      const {
         name,
         country,
         state,
         timezone_offset: tzOffset,
         current: {
            dt,
            feels_like,
            humidity,
            sunrise,
            sunset,
            temp,
            clouds,
            
            weather: [{ description, icon, main }],
         },
      } = deferredData

      return (
         <>
               <section className='p-20 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-1]'>
                  <h1 className='text-center text-3xl text-slate-800'>
                     Weather App
                  </h1>
                  <Underline />
                  <Clock tzOffset={tzOffset} dt={dt} />

                  <article className='bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] p-8 backdrop-blur-xl'>
                     <h2 className='text-2xl text-center'>
                        Weather the weather in{' '}
                        <span className=' relative'>
                           {name}
                           <div className=' absolute right-0 font-normal text-xs text-slate-600/50'>
                              {state}, {country}
                           </div>
                        </span>
                     </h2>
                     <div>
                        <div className='flex flex-col items-center justify-center relative'>
                           <img
                              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                              alt={main}
                           />
                           <div className='text-xs absolute bottom-2 left-[50%]'>
                              {description}
                           </div>
                        </div>
                     </div>
                     <div className='my-7 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <WeatherIconValuePair
                           icon={<LiaTemperatureHighSolid />}
                           iconValue={temp.toString() + ' °C'}
                        />
                        <WeatherIconValuePair
                           icon={<LiaGrinBeamSweatSolid />}
                           iconValue={feels_like.toString() + ' °C'}
                        />
                        <WeatherIconValuePair
                           icon={<FiSunrise />}
                           iconValue={new Date(+sunrise * 1000)
                              .toLocaleTimeString()
                              .toString()}
                        />

                        <WeatherIconValuePair
                           icon={<FiSunset />}
                           iconValue={new Date(+sunset * 1000)
                              .toLocaleTimeString()
                              .toString()}
                        />
                        <WeatherIconValuePair
                           icon={<WiHumidity />}
                           iconValue={humidity.toString() + ' %'}
                        />
                        <WeatherIconValuePair
                           icon={<BsFillCloudHazeFill />}
                           iconValue={clouds.toString() + ' %'}
                        />
                        {"rain" in deferredData.current ? "it's raining" : null}
                     </div>
                  </article>
               </section>
         </>
      )
   }
   if (!loaderData) {
      return (
         
               <section className='p-20 min-h-[80dvh] w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-1]'>
                  <h1 className='text-center text-3xl text-slate-800'>
                     Weather App
                  </h1>
                  <Underline />
                  <Clock />
                  <article className='bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] p-8 backdrop-blur-xl'>
                     <h2 className='text-2xl text-center'>
                        Weather the weather
                     </h2>
                     <div className='my-5 flex flex-col items-center justify-center relative'>
                        Nothing here yet...
                     </div>
                     <Link
                        className='text-md font-thin flex justify-center text-cyan-800 underline hover:text-cyan-600 focus-visible:text-cyan-600 transition-colors'
                        to='/locations'
                     >
                        <span className='text-center'>
                           Go to <b>Administer-Location-Page</b> to add a
                           location or turn on <b>Position</b> on your Browser.
                        </span>
                     </Link>
                  </article>
               </section>
         
      )
   }

   return (
      <Suspense fallback={<Loading />}>
         <Await resolve={loaderData}>{renderContent}</Await>
      </Suspense>
   )
}

export default App

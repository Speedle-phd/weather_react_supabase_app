import { Await, Link, useLoaderData } from 'react-router-dom'
import Underline from './components/Underline'
import Clock from './components/Clock'
import { Suspense } from 'react'
import { WiHumidity } from 'react-icons/wi'
import WeatherIconValuePair from './components/WeatherIconValuePair'
import { FiSunrise, FiSunset } from 'react-icons/fi'
import { LiaGrinBeamSweatSolid, LiaTemperatureHighSolid } from 'react-icons/lia'
import { BsFillCloudHazeFill } from 'react-icons/bs'
import { ImLocation } from 'react-icons/im'
import Loading from './components/Loading'
import { PiWindDuotone } from 'react-icons/pi'
import { rainingIntensity } from './utils/utils'


export interface WeatherDataInterface {
   dt: number
   humidity: number
   sunrise: number
   sunset: number
   clouds: number
   snow?: number
   wind_speed: number
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
   rain?: {
      "1h": number
   }
}
export interface CurrentWeatherDataInterface extends WeatherDataInterface {
   feels_like: number,
   temp: number,
   rain?: {
      "1h": number
   }
}

interface AppDataInterface {
   deferredData: {
      isGps: boolean
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

   const loaderData = useLoaderData() as AppDataInterface

   const renderContent = ({ deferredData }: AppDataInterface) => {
      console.log(deferredData)
      const {
         isGps,
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
            wind_speed,
            rain,
            
            weather: [{ description, icon, main }],
         },
      } = deferredData

      return (
         <>
            <section className='p-10 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-1]'>
               <h1 className='text-center text-3xl text-slate-800'>
                  Weather App
               </h1>
               <Underline />
               <Clock tzOffset={tzOffset} dt={dt} />

               <article className='bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md p-8 backdrop-blur-xl'>
                  <h2 className='text-2xl text-center'>
                     Weather the weather in{' '}
                     <span className=' relative'>
                        {name}
                        <div className=' absolute right-0 font-normal text-xs text-slate-600/50 flex gap-1'>
                           {isGps && <ImLocation />} {state}, {country}
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
                  <div
                     style={{
                        boxShadow:
                           '2px 2px 10px 1px rgba(0,0,0,.6), 3px 3px 15px 2px rgba(0,0,0,.4',
                     }}
                     className='bg-stone-800/60 text-white p-6 relative rounded-lg after:inset-[3px] after:absolute after:border-[1px] after:rounded-lg flex flex-col justify-center items-center mt-3'
                  >
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
                        <WeatherIconValuePair
                           icon={<PiWindDuotone />}
                           iconValue={wind_speed.toString() + ' m/s'}
                        />
                     </div>
                     {'rain' in deferredData.current ? (
                        <div className='bg-[rgba(255,255,255,0.7)] rounded-lg border-4 backdrop-blur-sm p-4 text-slate-700 text-sm'>
                           <h3 className="font-serif">{rainingIntensity(rain!['1h'])}</h3>
                           <p className="mt-3">{`${rain!['1h'].toString()} mm`}</p>
                        </div>
                     ) : null}
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

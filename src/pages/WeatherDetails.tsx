import { Await, Link, useLoaderData } from 'react-router-dom'
import { HourlyWeatherDataInterface, WeatherDataInterface } from '../App'
import { Suspense, useEffect, useRef } from 'react'
import Loading from '../components/Loading'
import Underline from '../components/Underline'
import WeatherIconValuePair from '../components/WeatherIconValuePair'
import DayWeather from '../components/DayWeather'
import { ImLocation } from 'react-icons/im'

interface DailyWeatherDataInterface extends WeatherDataInterface {
   temp: {
      day: number
      night: number
      eve: number
      morn: number
      max: number
      min: number
   }
   feels_like: {
      day: number
      night: number
      eve: number
      morn: number
   }
   summary: string
   pop: number
   wind_speed: number
   rain: number
}

interface DetailsDataInterface {
   deferredData: {
      isGps: boolean
      name: string
      state: string
      country: string
      timezone_offset: number
      timezone: string
      current: HourlyWeatherDataInterface
      daily: DailyWeatherDataInterface[]
      hourly: HourlyWeatherDataInterface[]
   }
}

const WeatherDetails = () => {
   const loaderData = useLoaderData()
   const hourTempRef = useRef<HTMLDivElement>(null)

   const handlePointer = (e: PointerEvent) => {
      const element = hourTempRef.current!
      const parent = element.parentElement!
      const x = e.clientX
      const posX = parent.scrollLeft
      element.setPointerCapture(e.pointerId)
      element.onpointermove = (ev: PointerEvent) => {
         const newX = ev.clientX
         const dx = newX - x
         const scrollAmplifier = 1.6
         parent.scrollLeft = posX - dx * scrollAmplifier
         window.onpointerup = (eve: PointerEvent) => {
            element.onpointermove = null
            element.releasePointerCapture(eve.pointerId)
         }
      }
   }

   useEffect(() => {
      const hourlyContainer = hourTempRef.current!
      hourlyContainer?.addEventListener('pointerdown', handlePointer)
      return () => {
         hourlyContainer?.removeEventListener('pointerdown', handlePointer)
      }
   }, [hourTempRef])

   const renderContent = (loaderData: DetailsDataInterface) => {
      const {deferredData} = loaderData
      const hourlyTempArray: {
         date: string
         temp: number
         icon: string
         rain: string
         pop: string
      }[] = []
      for (const hour of deferredData.hourly) {
         const date = new Date(
            hour.dt * 1000 + deferredData.timezone_offset
         ).toLocaleTimeString('DE-de', { hour: '2-digit', minute: '2-digit' })
         const temp = hour.temp
         const icon = hour.weather[0].icon
         let rain: string
         const pop = `${(hour.pop * 100)} %`
         if (hour.rain) {
            rain = `${hour.rain["1h"]} mm`
         } else {
            rain = `0 mm`
         }
         hourlyTempArray.push({ date, temp, icon, rain, pop })
      }
      const splicedHourlyTempArray = hourlyTempArray.splice(0, 24)

      

      const dailyWeatherArray: {
         date: string
         sunrise: string
         sunset: string
         tempMax: string
         tempMin: string
         icon: string
         description: string
         rain: string
         pop: string
         summary: string
         humidity: string
         windSpeed: string
      }[] = []
      for (const day of deferredData.daily) {
         const date = new Date(
            day.dt * 1000 + deferredData.timezone_offset
         ).toLocaleDateString('en-UK', {
            day: '2-digit',
            month: '2-digit',
            weekday: 'short',
         })
         const sunrise = new Date(
            day.sunrise * 1000 + deferredData.timezone_offset
         ).toLocaleTimeString()
         const sunset = new Date(
            day.sunset * 1000 + deferredData.timezone_offset
         ).toLocaleTimeString()
         const pop = `${day.pop*100}%`
         const tempMax = `${day.temp.max} °C`
         const tempMin = `${day.temp.min} °C`
         const icon = day.weather[0].icon
         const description = day.weather[0].description
         let rain: string
         if (day.rain) {
            rain = `${day.rain} mm`
         } else {
            rain = '0 mm'
         }
         const summary = day.summary
         const humidity = `${day.humidity.toFixed()} %`
         const windSpeed = `${day.wind_speed} m/s`
         dailyWeatherArray.push({date, sunrise, sunset, pop, tempMax, tempMin, icon, description, summary, humidity, windSpeed, rain})
      }
      const splicedDailyWeatherArray = dailyWeatherArray.splice(1, dailyWeatherArray.length)
      const todayData = deferredData.daily[0]



      return (
         <section className='p-10 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-10]'>
            <h1 className='text-center text-3xl text-slate-800'>
               Weather the details
            </h1>
            <Underline />
            <article className='my-10 bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] px-8 md:py-8 py-14 backdrop-blur-xl relative'>
               {/* @ts-ignore */}
               {/* <ReactFC {...hourlyTempConfigs} /> */}
               <h2 className='text-center mb-4 text-slate-900 text-2xl'>
                  Weather the next 24 hours
               </h2>
               <aside className='absolute top-2 right-10'>
                  <h3 className='flex items-center gap-1'>
                     <span>{deferredData.isGps && <ImLocation />}</span>
                     {deferredData.name}
                  </h3>
                  <div className=' absolute right-0 font-medium text-xs text-slate-600/50'>
                     {deferredData.state}, {deferredData.country}
                  </div>
               </aside>
               <div
                  style={{ userSelect: 'none', touchAction: 'none' }}
                  className='isolate overflow-x-hidden flex'
               >
                  <div
                     style={{ touchAction: 'none' }}
                     ref={hourTempRef}
                     className='flex cursor-grab justify-center items-center py-2 
                     '
                  >
                     {splicedHourlyTempArray.map(
                        ({ date, icon, temp, rain, pop }, index) => {
                           return (
                              <div
                                 key={index}
                                 className='flex flex-col w-50 px-2'
                              >
                                 <h3 className='text-lg'>{date}</h3>
                                 <img
                                    draggable={false}
                                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                                    alt='weather icon'
                                 />
                                 <p className='text-sm text-yellow-700/70'>{`${temp.toFixed(
                                    1
                                 )} °C`}</p>
                                 <img
                                    className='w-10 mt-3'
                                    draggable={false}
                                    src='https://openweathermap.org/img/wn/09n.png'
                                    alt='weather icon'
                                 />
                                 <p className='text-[0.7rem] text-center text-cyan-800'>
                                    {rain}
                                 </p>
                                 <p className='text-[0.7rem] text-center text-cyan-800/50'>
                                    {pop}
                                 </p>
                              </div>
                           )
                        }
                     )}
                  </div>
               </div>
               <div className='border p-4 rounded-sm mt-4'>
                  <div className='text-center text-sm text-slate-500'>
                     In a nutshell: <br />
                     <span className='text-lg text-zinc-800 font-serif italic'>
                        {todayData.summary}
                     </span>
                  </div>
               </div>
               <div className=' my-5 grid grid-cols-1 md:grid-cols-2'>
                  <WeatherIconValuePair
                     icon={<span className='text-sm'>MIN</span>}
                     iconValue={`${todayData.temp.min}°C`}
                  />
                  <WeatherIconValuePair
                     icon={<span className='text-sm'>MAX</span>}
                     iconValue={`${todayData.temp.max}°C`}
                  />
               </div>
               <Underline />
               <h2 className='my-6 text-center text-2xl'>
                  Weather the next week
               </h2>
               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                  {splicedDailyWeatherArray.map((el, index) => {
                     return <DayWeather key={index} {...el} />
                  })}
               </div>
            </article>
         </section>
      )
   }

   if (!loaderData) {
      return (
         <section className='p-20 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-1]'>
            <h2 className='text-center text-3xl text-slate-800'>
               Weather the details
            </h2>
            <Underline />
            <article className='my-10 bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] p-8 backdrop-blur-xl'>
               <div className='my-5 flex flex-col items-center justify-center relative'>
                  Nothing here yet...
               </div>
               <Link
                  className='text-md my-4 flex font-normal justify-center text-cyan-800 underline hover:text-cyan-600 focus-visible:text-cyan-600 transition-colors'
                  to='/locations'
               >
                  <span className='text-center'>
                     Go to{' '}
                     <b className='font-extrabold'>Administer-Location-Page</b>{' '}
                     to add a location or turn on{' '}
                     <b className='font-extrabold'>Position</b> on your Browser.{' '}
                     <br />
                  </span>
               </Link>
               <p className='text-sm text-center font-bold'>
                  Once you turned on geolocation it will preset your current
                  position as your favorite location when you are visiting the
                  "Home" page in case you haven't already picked one.
               </p>
               <p className='text-sm text-center font-bold'>
                  Note: If you are activating geolocation after initially declining, try to logout and login again.
               </p>
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

export default WeatherDetails

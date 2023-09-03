import { Await, Link, useLoaderData } from 'react-router-dom'
import { HourlyWeatherDataInterface, WeatherDataInterface } from '../App'
import { Suspense, useEffect, useRef } from 'react'
import Loading from '../components/Loading'
// Step 2 - Include the react-fusioncharts component
import ReactFC from 'react-fusioncharts'
// Step 3 - Include the fusioncharts library
import FusionCharts from 'fusioncharts'
// Step 4 - Include the chart type
import Line from 'fusioncharts/fusioncharts.charts'
// Step 5 - Include the theme as fusion
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import Underline from '../components/Underline'
// Step 6 - Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Line, FusionTheme)

// Create a JSON object to store the chart configurations

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
}

interface DetailsDataInterface {
   deferredData: {
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

   const handleMouseDown = (e: MouseEvent) => {
      const element = hourTempRef.current!
      const parent = element.parentElement!
      const x = e.clientX
      const posX = parent.scrollLeft
      element.onmousemove = (e: MouseEvent) => {
         const newX = e.clientX
         const dx = newX - x
         parent.scrollLeft = posX - dx
         window.onmouseup = () => {
            element.onmousemove = null
         }
      }
   }
   const handlePointer = (e: PointerEvent) => {
      const element = hourTempRef.current!
      const parent = element.parentElement!
      const x = e.clientX
      const posX = parent.scrollLeft
      element.setPointerCapture(e.pointerId)
      element.onpointermove = (e: PointerEvent) => {
         const newX = e.clientX
         const dx = newX - x
         parent.scrollLeft = posX - dx
         window.onpointerup = () => {
            element.onpointermove = null
            element.releasePointerCapture(e.pointerId)
         }
      }
   }

   useEffect(() => {
      const hourlyContainer = hourTempRef.current!
      hourlyContainer.addEventListener('mousedown', handleMouseDown)
      hourlyContainer.addEventListener('pointerdown', handlePointer)
      return () => {
         hourlyContainer.removeEventListener('mousedown', handleMouseDown)
         hourlyContainer.removeEventListener('pointerdown', handlePointer)
      }
   }, [hourTempRef])

   const renderContent = ({ deferredData }: DetailsDataInterface) => {
      console.log(
         new Date(
            deferredData.hourly[0].dt * 1000 + deferredData.timezone_offset
         )
      )
      const hourlyTempArray: { date: string; temp: number; icon: string }[] = []
      for (const hour of deferredData.hourly) {
         const date = new Date(
            hour.dt * 1000 + deferredData.timezone_offset
         ).toLocaleTimeString('DE-de', { hour: '2-digit', minute: '2-digit' })
         const temp = hour.temp
         const icon = hour.weather[0].icon
         hourlyTempArray.push({ date, temp, icon })
      }
      const splicedHourlyTempArray = hourlyTempArray.splice(0, 24)
      // const hourlyTempConfigs = {
      //    type: 'line', // The chart type
      //    width: '100%', // Width of the chart
      //    height: '400', // Height of the chart
      //    dataFormat: 'json', // Data type
      //    dataSource: {
      //       // Chart Configuration
      //       chart: {
      //          showBorder: '1',
      //          borderColor: '#666666',
      //          borderThickness: '4',

      //          // bgColor: "transparent",

      //          caption: 'Temperature in the next 24 hours', //Set the chart caption
      //       subCaption: 'In °C - Celsius', //Set the chart subcaption
      //          xAxisName: 'Hour', //Set the x-axis name
      //          yAxisName: 'Temperature', //Set the y-axis name
      //          numberSuffix: '°C',
      //          theme: 'fusion', //Set the theme for your chart
      //       },
      //       // Chart Data - from step 2
      //       data: hourlyTempArray.slice(0, 24),
      //    },
      // }

      return (
         <section className='p-10 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-10]'>
            <h1 className='text-center text-3xl text-slate-800'>
               Weather the details
            </h1>
            <Underline />
            <article className='my-10 bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] p-8 backdrop-blur-xl'>
               {/* @ts-ignore */}
               {/* <ReactFC {...hourlyTempConfigs} /> */}
               <section
                  style={{ userSelect: 'none' }}
                  className='isolate overflow-x-hidden flex'
               >
                  <div
                     ref={hourTempRef}
                     className='flex cursor-grab justify-center items-center py-2 
                     '
                  >
                     {splicedHourlyTempArray.map(
                        ({ date, icon, temp }, index) => {
                           console.log(date)
                           return (
                              <div
                                 key={index}
                                 className='flex flex-col w-50 px-2'
                              >
                                 <h3 className='text-lg'>{date}</h3>
                                 <img
                                    draggable={false}
                                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                                    alt=''
                                 />
                                 <p className='text-sm'>{`${temp.toFixed(
                                    1
                                 )} °C`}</p>
                              </div>
                           )
                        }
                     )}
                  </div>
               </section>
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
                  className='text-md font-thin flex justify-center text-cyan-800 underline hover:text-cyan-600 focus-visible:text-cyan-600 transition-colors'
                  to='/locations'
               >
                  <span className='text-center'>
                     Go to <b>Administer-Location-Page</b> to add a location or
                     turn on <b>Position</b> on your Browser.
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

export default WeatherDetails

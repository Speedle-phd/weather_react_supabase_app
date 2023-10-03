import { Suspense, useEffect, useRef, useState } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import Loading from '../components/Loading'
import Underline from '../components/Underline'
import redOverClouds from '../assets/red_over_clouds.jpg'
import blueClouds from '../assets/blue_clouds.jpg'
import LocationGridTile from '../components/LocationGridTile'
import { FaTrash } from 'react-icons/fa'
import { AiTwotoneStar } from 'react-icons/ai'
import axios, { isAxiosError } from 'axios'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { useDebounce } from '../hooks/useDebounce'
import { supabase } from '../context/DataBaseContextProvider'
import { CurrentWeatherDataType, GeoDataType } from '../api/loader'
import { PostgrestError } from '@supabase/supabase-js'
import { InsertData } from '../types/database.types'

interface LoaderInterface {
   deferredData: ReturnDataInterface[]
}
interface ReturnDataInterface {
   state: string
   country: string
   name: string
   lat: number
   long: number
   isGps: boolean
   isSet: boolean
   description: string
   icon: string
   temp: number
   id: string

}
// type GeolocationType = {
//    data: [GeolocationDataType]
// }
type GeolocationDataType = {
   state: string
   name: string
   country: string
   lon: number
   lat: number
   local_names?: {
      [key: string]: string
   }
}

const Locations = () => {
   const OPEN_WEATHER_API_KEY = import.meta.env
      .VITE_API_KEY_OPEN_WEATHER as string
   const loaderData = useLoaderData() as LoaderInterface
   const [showQuery, setShowQuery] = useState<boolean>(false)
   const findIsSet = loaderData?.deferredData.find((el) => el.isSet)
   const [favoritePlace, setFavoritePlace] = useState<
      ReturnDataInterface | undefined
   >(findIsSet)
   const [allData, setAllData] = useState<ReturnDataInterface[] | []>(
      loaderData?.deferredData
   )
   //TODO: make an alert for error handling
   const [error, setError] = useState<{ msg: string } | null>(null)
   const cityRef = useRef<HTMLInputElement>(null)
   const latRef = useRef<HTMLInputElement>(null)
   const longRef = useRef<HTMLInputElement>(null)
   // eslint-disable-next-line @typescript-eslint/no-misused-promises
   const [setQuery] = useDebounce(getCityList, 2000)
   const [queryResults, setQueryResults] = useState<
      GeolocationDataType[] | null
   >(null)

   function compareCoords(
      el: { lat: number; long: number },
      lat: number,
      long: number
   ) {
      const LIMES = 0.5
      const { lat: elLat, long: elLong } = el
      console.log(elLat - LIMES, lat, elLat + LIMES)
      if (
         elLat - LIMES < lat &&
         elLat + LIMES > lat &&
         elLong - LIMES < long &&
         elLong + LIMES > long
      ) {
         console.log(true)
         return true
      }
      console.log(false)
      return false
   }
   // useActionData()
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)
      const city = formData.get('city') as string
      const lat = formData.get('lat') as string
      const long = formData.get('long') as string
      if (!long || !lat) {
         setError({
            msg: 'Please select a city, so longitude and latitude values are provided',
         })
         return console.log('Invalid values')
      }
      try {
         let stopFunction = false
         loaderData.deferredData.forEach((el) => {
            if (el.isGps) {
               return
            }
            const hasListed = compareCoords(el, +lat, +long)
            if (hasListed && el.name === city) {
               setError({ msg: 'Coordinates already exist.' })
               stopFunction = true
               return
            }
         })

         if (stopFunction) return
         console.log('why?')
         const { data: userData } = await supabase.auth.getUser()
         const {data, error} : {data: unknown[] | null, error: PostgrestError | null} = ( await supabase
            .from('weather_data')
            .insert([{ lat, long, user_id: userData.user!.id }])
            .select())
         
         if (error) {
            setError({ msg: error.message })
         }
         if (data && data.length > 0) {
            const dataSet = data[0] as InsertData<'weather_data'>
            const currentWeatherUrl =
               'https://api.openweathermap.org/data/2.5/weather'
            const GEO_URL = `https://api.openweathermap.org/geo/1.0/reverse`
            const res = await axios<CurrentWeatherDataType>(currentWeatherUrl, {
               params: {
                  units: 'metric',
                  lat,
                  lon: long,
                  appid: OPEN_WEATHER_API_KEY,
                  exclude: 'minutely,hourly,daily,alerts',
               },
            })
            const res2 = await axios<GeoDataType[]>(GEO_URL, {
               params: {
                  lat,
                  lon: long,
                  appid: OPEN_WEATHER_API_KEY,
               },
            })
            

            if (res.status === 200 && res2.status === 200) {
               const { data: weatherData } = res
               const { data: geoData } = res2

               const dataObj = {
                  state: geoData[0].state,
                  country: geoData[0].country,
                  name: geoData[0].name,
                  temp: weatherData.main.temp,
                  icon: weatherData.weather[0].icon,
                  description: weatherData.weather[0].main,
                  lat: dataSet.lat,
                  long: dataSet.long,
                  isGps: dataSet.isgps as boolean,
                  isSet: dataSet.isset as boolean,
                  id: dataSet.id as string
               }
               setAllData(prev => {
                  return [...prev, dataObj]
               })
            }
            (e.target as HTMLFormElement).reset()
         }
      } catch (error) {
         console.log(error)
      }
   }

   const handleSetFavorite = async(id: string) => {
      const newFavorite = allData.find(el => el.id === id)
      const mappedData = allData.map(el => {
         if (el.id === id) {
            el.isSet = true
         } else {
            el.isSet = false
         }
         return el
      })
      try {
         const { error } = await supabase.from('weather_data').update({isset: false}).eq("isset", true)
         if (error){
            setError({msg: error.message})
            return
         }
         const { error: setFavError } = await supabase.from('weather_data').update({isset: true}).eq('id', id)
         if (setFavError){
            setError({msg: setFavError.message})
            return
         }
         setFavoritePlace(newFavorite)
         setAllData(mappedData)

      } catch (error) {
         console.log(error)
      }
   }

   const handleDelete = async(id: string) => {
      const filteredArray = allData.filter(el => el.id !== id)
      
      try {
         const { error } = await supabase.from('weather_data').delete().eq('id', id)
         if (error) {
            setError({msg: error.message})
         } else {
            setAllData(filteredArray)
         }
      } catch (error) {
         console.log(error)
      }
   }

   async function getCityList(query: string) {
      const url = 'https://api.openweathermap.org/geo/1.0/direct'
      if (!query) return
      try {
         const res = await axios<unknown>(url, {
            params: {
               q: query,
               appid: OPEN_WEATHER_API_KEY,
               limit: 5,
            },
         })
         if (res.status === 200 && res.data) {
            console.log(res.data)
            setQueryResults(res.data as GeolocationDataType[])
         }
      } catch (error) {
         if (isAxiosError(error)) {
            throw {
               msg: error.response?.statusText,
               status: error.response?.status,
            }
         } else {
            throw error
         }
      }
   }

   function handleChange() {
      setQueryResults(null)
      const city = cityRef.current?.value
      console.log(city)
      if (!city) return setQueryResults(null)
      setQuery(city)
   }
   function chooseCity(e: React.MouseEvent | React.KeyboardEvent) {
      const lat = (e.currentTarget as HTMLButtonElement).dataset.lat as string
      const long = (e.currentTarget as HTMLButtonElement).dataset.long as string
      longRef.current!.value = long
      latRef.current!.value = lat
      setQueryResults(null)
   }

   useEffect(() => {
      const myTimeout = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(myTimeout)
   }, [error])

   useEffect(() => {
      console.log(queryResults)
      console.log(favoritePlace)
      console.log(allData)
   }, [favoritePlace, allData, queryResults])

   const renderHtml = ({ deferredData }: LoaderInterface) => {
      console.log(deferredData)
      return (
         <section className=' py-10 px-10 md:px-20 lg:px-32 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-2]'>
            {error ? (
               <aside className='bg-red-700/90 text-white/80 absolute w-[80%] top-10 left-1/2 rounded-lg translate-x-[-50%] z-1000 px-5 py-2 text-center'>
                  {error.msg}
               </aside>
            ) : null}
            <h1 className='text-center text-3xl text-slate-800'>
               Weather the locations
            </h1>
            <Underline />
            <article className='my-10 bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] p-8 backdrop-blur-xl relative items-center flex flex-col'>
               <h3 className='my-5 text-center text-2xl underline'>
                  Seek a sun-radiated area
               </h3>
               <section className='my-4'>
                  {showQuery ? (
                     <form
                        className='query-form flex flex-col gap-2 w-[clamp(8rem,100%,20rem)] mx-auto'
                        onSubmit={(e: React.FormEvent) => void handleSubmit(e)}
                     >
                        <div className='form-control grid grid-cols-1 relative'>
                           <input
                              className='px-3 py-2 text-xs placeholder:text-[0.5rem] rounded-sm'
                              placeholder={'Search for a city...'}
                              onChange={() => void handleChange()}
                              ref={cityRef}
                              type='text'
                              name='city'
                              id='city'
                           />
                           {queryResults &&
                           queryResults?.length > 0 &&
                           cityRef.current!.value.length > 0 ? (
                              <aside className='absolute top-6 w-full left-0 z-100 bg-white border-4 border-stone-800'>
                                 {queryResults.map((el, index) => {
                                    const isOdd = index % 2 == 0
                                    console.log(isOdd)
                                    const { country, lat, lon, name, state } =
                                       el
                                    return (
                                       <button
                                          key={index}
                                          data-lat={lat}
                                          data-long={lon}
                                          onClick={(
                                             e:
                                                | React.MouseEvent
                                                | React.KeyboardEvent
                                          ) => void chooseCity(e)}
                                          style={{
                                             background: `${
                                                isOdd
                                                   ? `linear-gradient(90deg, #fff ${
                                                        index * 5
                                                     }%, rgba(218, 165, 32, .8))`
                                                   : `linear-gradient(90deg, #fff ${
                                                        index * 5
                                                     }%, rgba(57, 131, 121, .8))`
                                             }`,
                                          }}
                                          className='flex p-2 items-center w-full hover:opacity-75'
                                       >
                                          <div className='w-full text-left flex justify-between items-center'>
                                             <div className='flex flex-col'>
                                                <div>{name}</div>
                                                <div className='text-xs text-gray-500 font-normal'>
                                                   {state}, {country}
                                                </div>
                                             </div>
                                             <span
                                                className={`fi fi-${country.toLowerCase()}`}
                                             ></span>
                                          </div>
                                       </button>
                                    )
                                 })}
                              </aside>
                           ) : null}
                        </div>
                        <div className='form-control grid grid-cols-2 gap-1 bg-slate-600 p-2 rounded-sm'>
                           <label
                              className='text-xs text-white/80'
                              htmlFor='lat'
                           >
                              Latitude
                           </label>
                           <label
                              className='text-xs text-white/80'
                              htmlFor='long'
                           >
                              Longitude
                           </label>
                           <input
                              className='cursor-default rounded-lg bg-slate-800 text-white/90 text-sm px-3 py-1'
                              readOnly
                              type='text'
                              name='lat'
                              id='lat'
                              ref={latRef}
                           />
                           <input
                              className='cursor-default rounded-lg bg-slate-800 text-white/90 text-sm px-3 py-1'
                              readOnly
                              type='text'
                              name='long'
                              id='long'
                              ref={longRef}
                           />
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                           <button
                              type='submit'
                              className='bg-amber-300 hover:bg-amber-500 transition-colors focus-visible:bg-amber-500 p-2 rounded-lg text-sm'
                           >
                              Add New Site
                           </button>
                           <button
                              onClick={() => setShowQuery(false)}
                              className='bg-rose-900 text-white/90 p-2 rounded-lg hover:bg-rose-800 focus-visible:bg-rose-800 transition-colors text-sm'
                           >
                              Cancel
                           </button>
                        </div>
                     </form>
                  ) : (
                     <button
                        onClick={() => setShowQuery(true)}
                        className='bg-amber-300 hover:bg-amber-500 transition-colors focus-visible:bg-amber-500 text-black/70 rounded-lg text-sm w-fit px-3 py-2 cursor-pointer'
                     >
                        Search for a sunny place.
                     </button>
                  )}
               </section>
               <hr className='w-full' />
               <section className='w-full my-4 flex flex-col items-center'>
                  <h4 className='text-center mb-6 lg:text-2xl underline'>
                     Favorite Spot
                  </h4>
                  {favoritePlace ? (
                     <div
                        data-id={favoritePlace?.id}
                        style={{ backgroundImage: `url(${redOverClouds})` }}
                        className='w-[clamp(8rem,100%,20rem)] min-h-[10rem] aspect-video bg-cover bg-center z-[-1] relative rounded-lg'
                     >
                        <LocationGridTile location={favoritePlace} />
                     </div>
                  ) : (
                     <div className='w-[clamp(8rem,100%,20rem)] min-h-[10rem] aspect-video bg-cover bg-center z-[-1] relative rounded-lg bg-stone-800'>
                        <div className='absolute inset-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center'>
                           <h4 className="underline text-red-700/80 text-xl">404 - Spot not found</h4>
                           <p className="text-[0.8rem] mt-3 leading-4">You haven't set any favorite place yet.<br />
                           Make sure to either add a location and mark it or turning on geolocation in your browser.
                           </p>
                        </div>
                     </div>
                  )}
               </section>
               <hr className='w-full' />
               <section className='w-full my-4 flex flex-col items-center'>
                  <h4 className='text-center mb-6 lg:text-2xl underline'>
                     The Other Sides
                  </h4>
                  <div className='w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                     {(allData ?? [])
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((el) => {
                           const disabled = el.id === favoritePlace?.id
                           return (
                              <div
                                 className='w-full'
                                 data-id={el.id}
                                 key={el.id}
                              >
                                 <div
                                    style={{
                                       backgroundImage: `url(${blueClouds})`,
                                    }}
                                    className='w-[clamp(8rem,100%,20rem)] bg-cover bg-center bg-blend-difference min-h-[10rem] aspect-video bg-stone-700 isolate relative rounded-lg mx-auto'
                                 >
                                    <LocationGridTile
                                       key={el.id}
                                       location={el}
                                    />
                                 </div>
                                 <div className='flex justify-center gap-10 mt-2 p-2'>
                                    <button
                                       className='border-2 border-zinc-600 rounded-sm w-8 h-8 p-1 flex justify-center items-center cursor-pointer hover:rotate-[360deg] focus-visible:rotate-[360deg] transition-all hover:bg-white duration-300 focus-visible:bg-white'
                                       disabled={disabled ? true : false}
                                       onClick={() => void handleSetFavorite(el.id)}
                                    >
                                       <AiTwotoneStar
                                          style={{
                                             color: `${
                                                disabled
                                                   ? '#222'
                                                   : 'rgb(234 179 8 / 0.7)'
                                             }`,
                                          }}
                                       />
                                    </button>
                                    <button
                                       className='border-2 border-zinc-600 rounded-sm w-8 h-8 p-1 flex justify-center items-center cursor-pointer hover:rotate-[360deg] focus-visible:rotate-[360deg] transition-all hover:bg-white duration-300 focus-visible:bg-white'
                                       onClick={() =>
                                          void handleDelete(el.id)
                                       }
                                    >
                                       <FaTrash className='text-red-900 ' />
                                    </button>
                                 </div>
                                 <hr />
                              </div>
                           )
                        })}
                  </div>
               </section>
            </article>
            {/* Form For Search Queries; Keep in Mind: Action*/}
         </section>
      )
   }

   return (
      <Suspense fallback={<Loading />}>
         <Await resolve={loaderData}>{renderHtml}</Await>
      </Suspense>
   )
}

export default Locations

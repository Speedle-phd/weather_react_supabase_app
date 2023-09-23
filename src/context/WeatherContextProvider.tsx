import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
} from 'react'
import Cookies from 'universal-cookie'


const cookie = new Cookies()

interface WeatherContextInterface {
   setCurrentLocationFn: (l: LocationInterface) => void
   location: LocationInterface | null
}
export interface LocationInterface {
   latitude: number
   longitude: number
}

const WeatherContext = createContext<WeatherContextInterface | null>(null)

const WeatherContextProvider = ({ children }: React.PropsWithChildren) => {
   const [location, setLocation] = useState<LocationInterface | null>(null)
   const [locationModal, setLocationModal] = useState<boolean>(false)
   // GEOLOCATION API
   const success = useCallback((pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords
      // console.log(`More or less ${accuracy} meters.`)
      cookie.set('panda-cookie-lat', latitude, { path: '/' })
      cookie.set('panda-cookie-long', longitude, { path: '/' })
      setCurrentLocationFn({ latitude, longitude })
   }, [])
   const error = useCallback((err: GeolocationPositionError) => {
      cookie.remove('panda-cookie-lat', { path: '/' })
      cookie.remove('panda-cookie-long', { path: '/' })
      console.warn(`ERROR(${err.code}): ${err.message}`)
   }, [])
   const allowPermission = useCallback(() => {
      const options = {
         enableHighAccuracy: true,
         timeout: 5000,
         maximumAge: 0,
      }
      navigator.geolocation.getCurrentPosition(success, error, options)
      setLocationModal(false)
   },[error, success])

   const checkPermission = useCallback(async() => {
      const permission = await navigator.permissions.query({
         name: 'geolocation',
      })
      if (permission.state === 'prompt') {
         setLocationModal(true)
      } else {
         if (permission.state === 'granted'){
            allowPermission()
         } else if (permission.state === 'denied') {
            console.log(permission.state)
         }
         setLocationModal(false)
      }
   },[allowPermission])
   // const denyPermission = () => {
   //    setLocationModal(false)
   // }

   useEffect(() => {
      checkPermission().catch((err) => console.log(err))
   }, [checkPermission])

   function setCurrentLocationFn(l: LocationInterface) {
      setLocation(l)
   }

   return (
      <WeatherContext.Provider value={{ setCurrentLocationFn, location }}>
         {children}
         {locationModal ? (
            <aside className='flex flex-col items-center fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-zinc-800 py-3 px-6 rounded-lg after:inset-[-200vw] after:absolute after:bg-black/40 after:z-[-1] w-[clamp(20rem,50vw,40rem)]'>
               <h2 className='text-center text-3xl mb-5'>
                  Permission for geolocation
               </h2>
               <p
                  className={`bg-zinc-800/50 p-4 text-sm font-thin mb-4 relative after:inset-5 after:absolute after:bg-cloudPng after:z-[-10] after:bg-contain after:bg-center after:blur-sm rounded-lg after:bg-no-repeat shadow-[0px_5px_15px_#fff2]`}
               >
                  This website uses geolocation for fetching the weather data of
                  your current position.
                  <br />
                  Your position is only used for that purpose alone and will not
                  be provided to 3rd-parties.
                  <br />
                  The weather app will work without permission for your current
                  location as well.
                  <br />
                  In case you want to provide your location, click "Got it" and
                  accept the prompt of your browser at the top of the window.
                  Otherwise deny the request of the browser.
               </p>
               <button
                  onClick={allowPermission}
                  className='rounded-lg bg-teal-600 hover:bg-teal-800 focus-visible:bg-teal-800 transition-colors min-w-[7rem] py-2 mb-3'
               >
                  Got it.
               </button>
               {/* <button
                  onClick={denyPermission}
                  className='rounded-lg focus-visible:bg-slate-800 bg-slate-600 hover:bg-slate-800 transition-colors min-w-[7rem] py-2'
               >
                  Disagree
               </button> */}
            </aside>
         ) : null}
      </WeatherContext.Provider>
   )
}

export default WeatherContextProvider

// eslint-disable-next-line react-refresh/only-export-components
export const useWeatherContext = () => {
   return useContext(WeatherContext)
}

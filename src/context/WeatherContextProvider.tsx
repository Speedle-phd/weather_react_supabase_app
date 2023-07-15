import { createContext, useCallback, useContext, useEffect, useState } from 'react'

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

   // GEOLOCATION API
   const success = useCallback((pos : GeolocationPosition) => {
      const {latitude, longitude, accuracy} = pos.coords
      console.log('Your current position is:')
      console.log(`Latitude : ${latitude}`)
      console.log(`Longitude: ${longitude}`)
      console.log(`More or less ${accuracy} meters.`)
      setCurrentLocationFn({latitude, longitude})
   },[])
   const error = useCallback((err: GeolocationPositionError) => {
      console.warn(`ERROR(${err.code}): ${err.message}`)
   },[])
   useEffect(() => {
      const options = {
         enableHighAccuracy: true,
         timeout: 5000,
         maximumAge: 0,
      }
      navigator.geolocation.getCurrentPosition(
         success,
         error,
         options)
   }, [success, error])

   useEffect(() => {
      console.log(location)
   }, [location])

   function setCurrentLocationFn(l: LocationInterface) {
      setLocation(l)
   }

   return (
      <WeatherContext.Provider value={{ setCurrentLocationFn, location }}>
         {children}
      </WeatherContext.Provider>
   )
}

export default WeatherContextProvider

export const useWeatherContext = () => {
   return useContext(WeatherContext)
}

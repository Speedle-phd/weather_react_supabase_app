import { redirect, defer } from 'react-router-dom'
import { supabase } from '../context/DataBaseContextProvider'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'universal-cookie'
import { User } from '@supabase/supabase-js'

const cookie = new Cookies()

const URL = 'https://api.openweathermap.org/data/3.0/onecall'
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_API_KEY_OPEN_WEATHER as string
const GEO_URL = `https://api.openweathermap.org/geo/1.0/reverse`
// const GEO_URL = `http://api.openweathermap.org/geo/1.0/direct?q=bamberg&limit=5&appid=${OPEN_WEATHER_API_KEY}`

export const isLoggedIn = async () => {
   const { data } = await supabase.auth.getSession()
   if (data.session) {
      return data.session
   }
   return redirect('/login')
}

// TODO: handle redirect to "/". Fails for now because after login page isn't rerendered and loader isn't triggered
export const isNotLoggedIn = async () => {
   const { data } = await supabase.auth.getSession()
   if (data.session) {
      return redirect('/')
   }
   return true
}

export type GeoDataType = {
   country: string
   lat: number
   local_names: object
   lon: number
   name: string
   state: string
}

type WeatherDataReponseType = {
   id: string
   inserted_at: string
   isgps: boolean
   isset: boolean
   lat: number
   long: number
   updated_at: string
   user_id: string
}




export const appLoader = async () => {
   try {
      const gpsLat = cookie.get('panda-cookie-lat') as number
      const gpsLong = cookie.get('panda-cookie-long') as number
      const { data } = await supabase.auth.getSession()
      const user = data.session!.user
      const username = user.user_metadata.username as string
      const avatar = user.user_metadata.avatar as string

      // const avatarPosition = user.user_metadata.avatarPosition as {imgXPosition: number; imgYPosition: number}
      const gpsPermission = await navigator.permissions.query({
         name: 'geolocation',
      })
      const permissionState = gpsPermission.state
      //GPS
      let gpsActivated = false
      if (permissionState === 'granted') {
         const { data: gpsUpdateData, error: gpsUpdateError } = await supabase
            .from('weather_data')
            .update([
               {
                  lat: gpsLat,
                  long: gpsLong,
                  user_id: user.id,
                  isgps: true,
                  updated_at: new Date(),
               },
            ])
            .match({ isgps: true, user_id: user.id })
            .select()
         if (gpsUpdateError) {
            console.log(gpsUpdateError)
         }
         if (gpsUpdateData!.length === 0) {
            const { data: insertGpsData, error: insertError } = await supabase
               .from('weather_data')
               .insert([
                  {
                     lat: gpsLat,
                     long: gpsLong,
                     user_id: user.id,
                     isgps: true,
                  },
               ])
               .select()
            if (insertError) {
               console.log(insertError)
            }
            if (insertGpsData) {
               gpsActivated = true
            }
         } else {
            gpsActivated = true
         }
      } else {
         const { error: deleteError } = await supabase
            .from('weather_data')
            .delete()
            .eq('isgps', true)
         if (deleteError) {
            console.log(deleteError)
         }
      }

      const { data: getIsSetData, error: getError } = await supabase
         .from('weather_data')
         .select()
         .eq('isset', true)

      const isSetData = (getIsSetData as WeatherDataReponseType[])?.find(
         (el) => el.isset
      )
      const isGps = isSetData ? isSetData?.isgps : true
      const lat = isSetData ? isSetData.lat : gpsLat
      const long = isSetData ? isSetData.long : gpsLong
      if (!gpsActivated && getIsSetData!.length === 0) {
         return null
      }

      if (!isSetData) {
         // const { data: isSetUpdateData, error: isSetUpdateError } =
            await supabase
               .from('weather_data')
               .update([
                  {
                     isset: true,
                  },
               ])
               .match({ isgps: true, user_id: user.id })
               .select()
      }

      const res = await axios<AxiosResponse>(URL, {
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
         const geoObj = {
            state: geoData[0].state,
            country: geoData[0].country,
            name: geoData[0].name,
         }
         const returnData = {
            ...weatherData,
            ...geoObj,
            username,
            avatar,
            isGps,
         }
         return defer({ deferredData: returnData })
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         throw {
            msg: error.response?.statusText,
            status: error.response?.status,
         }
      } else {
         throw error
      }
   }
}

export const detailLoader = async () => {
   try {
      // const gpsLat = cookie.get('lat') as number
      // const gpsLong = cookie.get('long') as number
      const { data: dataArray, error: getError } = await supabase
         .from('weather_data')
         .select()
         .eq('isset', true)

      if (dataArray?.length == 0 || !dataArray) {
         return null
      }
      const isSetData = dataArray[0] as {
         lat: number
         long: number
         isgps: boolean
      }

      const isGps = isSetData.isgps
      const lat = isSetData.lat
      const long = isSetData.long

      const res = await axios<AxiosResponse>(URL, {
         params: {
            units: 'metric',
            lat,
            lon: long,
            appid: OPEN_WEATHER_API_KEY,
            exclude: 'minutely',
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
         const geoObj = {
            state: geoData[0].state,
            country: geoData[0].country,
            name: geoData[0].name,
         }
         const returnData = {
            ...weatherData,
            ...geoObj,
            isGps,
         }

         return defer({ deferredData: returnData })
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         throw {
            msg: error.response?.statusText,
            status: error.response?.status,
         }
      } else {
         throw error
      }
   }
   return true
}

export const settingsLoader = async () => {
   try {
      const { data: userData } = await supabase.auth.getUser()
      const email = userData?.user?.email
      const username = userData.user?.user_metadata.username as string
      const avatar = userData.user?.user_metadata.avatar as string
      const userId = userData.user?.id
      return defer({ deferredData: { username, avatar, email, userId } })
   } catch (err) {
      console.log(err)
      throw err
   }
}



async function updateGpsEntry (user_id: string) {

   try {
      const gpsPermission = await navigator.permissions.query({
         name: 'geolocation',
      })
      const permissionState = gpsPermission.state
      if (permissionState === 'granted') {
         // const { data: user } = await supabase.auth.getUser()
         const gpsLat = cookie.get('panda-cookie-lat') as number
         const gpsLong = cookie.get('panda-cookie-long') as number
         const { data: gpsUpdateData, error: gpsUpdateError } = await supabase
            .from('weather_data')
            .update([
               {
                  lat: gpsLat,
                  long: gpsLong,
                  user_id,
                  isgps: true,
                  updated_at: new Date(),
               },
            ])
            .match({ isgps: true, user_id })
            .select()
         if (gpsUpdateError) {
            console.log(gpsUpdateError)
         }
         if (gpsUpdateData!.length === 0) {
            const { error: insertError } = await supabase
               .from('weather_data')
               .insert([
                  {
                     lat: gpsLat,
                     long: gpsLong,
                     user_id,
                     isgps: true,
                  },
               ])
               .select()
            if (insertError) {
               console.log(insertError)
            }

         }
      } else {
         const { error: deleteError } = await supabase
            .from('weather_data')
            .delete()
            .eq('isgps', true)
         if (deleteError) {
            console.log(deleteError)
         }
      }
      
   } catch (error) {
      console.log(error)  
   }
}

export interface ReturnDataType {
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
export type CurrentWeatherDataType = {
   main: {temp: number}
   weather: [
      {
         icon: string
         main: string
      }
   ]
}

export const locationLoader = async () => {
   const url = 'https://api.openweathermap.org/data/2.5/weather'



   let returnData: ReturnDataType[] = []
   try {
      const { data: userData } = await supabase.auth.getUser()
      userData.user ? await updateGpsEntry(userData.user.id) : null
      const { data, error } = await supabase
         .from('weather_data')
         .select('*')
         .eq('user_id', userData.user?.id)
      if (error) {
         throw error
      }
      await Promise.all(
         data.map(
            async (el: {
               lat: number
               long: number
               isgps: boolean
               isset: boolean
               id: string
            }) => {
               const res = await axios<GeoDataType[]>(GEO_URL, {
                  params: {
                     lat: el.lat,
                     lon: el.long,
                     appid: OPEN_WEATHER_API_KEY,
                     
                  },
               })
               const res2 = await axios<CurrentWeatherDataType>(url, {
                  params: {
                     lat: el.lat,
                     lon: el.long,
                     appid: OPEN_WEATHER_API_KEY,
                     units: 'metric',
                  },
               })
               if (res.status === 200 && res2.status === 200) {
                  const { data: geoData } = res
                  const { data: weatherData } = res2
                  const dataObj = {
                     state: geoData[0].state,
                     country: geoData[0].country,
                     name: geoData[0].name,
                     lat: el.lat,
                     long: el.long,
                     isGps: el.isgps,
                     isSet: el.isset,
                     temp: weatherData.main.temp,
                     icon: weatherData.weather[0].icon,
                     description: weatherData.weather[0].main,
                     id: el.id
                  }
                  returnData = [...returnData, dataObj]
               }
            }
         )
      )
      return defer({ deferredData: returnData })
   } catch (error) {
      console.log(error)
      throw error
   }
}

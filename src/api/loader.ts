import { redirect, defer } from 'react-router-dom'
import { CookieType, supabase } from '../context/DataBaseContextProvider'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'universal-cookie'

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
   console.log(data)
   if (data.session) {
      return redirect('/')
   }
   return true
}

type GeoDataType = {
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
      const gpsLat = cookie.get('lat') as number
      const gpsLong = cookie.get('long') as number
      const { data } = await supabase.auth.getSession()
      const user = data.session!.user
      console.log(user)
      const username = user.user_metadata.username as string
      const avatar = user.user_metadata.avatar as string
      //GPS
      const { data: gpsData, error: gpsError } = await supabase
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
      console.log(gpsData, gpsError)
      if (gpsData!.length === 0) {
         const { data: insertData, error: insertError } = await supabase
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
         console.log(insertData, insertError)
      }

      const { data: getAllData, error: getError } = await supabase
         .from('weather_data')
         .select()
         .eq("isset", true)
      console.log(getAllData, getError)

      const isSetData = (getAllData as WeatherDataReponseType[])?.find(
         (el) => el.isset
      )
      const isGps = isSetData ? isSetData?.isgps : true
      const lat = isSetData ? isSetData.lat : gpsLat
      const long = isSetData ? isSetData.long : gpsLong
      if (gpsData?.length === 0) {
         return null
      }

      if (!isSetData) {
         const { data: isSetUpdateData, error: isSetUpdateError } =
            await supabase
               .from('weather_data')
               .update([
                  {
                     isset: true,
                  },
               ])
               .match({ isgps: true, user_id: user.id })
               .select()
         console.log(isSetUpdateData, isSetUpdateError)
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
         const returnData = { ...weatherData, ...geoObj, username, avatar, isGps }

         return defer({ deferredData: returnData })
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         console.log('axiosError')
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
      const gpsLat = cookie.get('lat') as number
      const gpsLong = cookie.get('long') as number
      const { data: dataArray, error: getError } = await supabase
         .from('weather_data')
         .select()
         .eq('isset', true)
      console.log(dataArray, getError)


      if (dataArray?.length == 0 || !dataArray) {
         return null
      }
      const isSetData = dataArray[0] as {lat: number; long: number; isgps: boolean}

      const isGps = isSetData.isgps 
      let lat: number
      let long: number
      if (isSetData.isgps){
         lat = gpsLat
         long = gpsLong
      } else {
         lat = isSetData.lat
         long = isSetData.long
      }

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
            isGps
         }

         return defer({ deferredData: returnData })
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         console.log('axiosError')
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

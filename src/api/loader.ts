import { redirect } from "react-router-dom"
import { supabase } from "../context/DataBaseContextProvider"
import axios from "axios"


// const open_weather_current_weather_endpoint = `https://api.openweathermap.org/data/2.5/weather?`
//lat lon appid=APIKEY mode units=metric lang
// const open_meteo_endpoint = `https://api.open-meteo.com/v1/forecast?`


// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
const URL = "https://api.openweathermap.org/data/3.0/onecall"
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_API_KEY_OPEN_WEATHER as string
const LAT = 49.8991104
const LONG = 10.8593152


export const isLoggedIn = async() => {
   const { data }= await supabase.auth.getSession()
   if (data.session) {
      return data.session
   }
   return redirect('/login')
}

// TODO: handle redirect to "/". Fails for now because after login page isn't rerendered and loader isn't triggered
export const isNotLoggedIn = async() => {
   const {data} = await supabase.auth.getSession()
   console.log(data)
   if (data.session) {
      return redirect("/")
   }
   return true
}

type WeatherResponseType = {
   data: object
   status: number
}

export const appLoader = async() => {
   try {
      const res = await axios<WeatherResponseType>(URL, { params: { units: "metric", lat: LAT, lon: LONG, appid: OPEN_WEATHER_API_KEY, exclude: "minutely,hourly,daily,alerts"}})
      if (res.status === 200) {
         const {data} = res
         console.log(data)
         return data
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return {msg: error.response?.statusText, status: error.response?.status}
      } else {
         return error
      }
   }
}


import { redirect } from "react-router-dom"
import { supabase } from "../context/DataBaseContextProvider"

export const isLoggedIn = async() => {
   const { data }= await supabase.auth.getSession()
   console.log(data)
   if (data.session) {
      return data.session
   }
   return redirect('/login')
}

// TODO: handle redirect to "/". Fails for now because after login page isn't rerendered and loader isn't triggered
export const isNotLoggedIn = async() => {
   const {data} = await supabase.auth.getSession()
   console.log(data.session)
   if (data.session) {
      return redirect("/")
   }
   return true
}
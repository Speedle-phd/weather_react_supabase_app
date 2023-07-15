import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface DatabaseContextInterface {
   test: string
   loginFn: () => Promise<void>
   logoutFn: () => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextInterface | null>(null)

const DatabaseContextProvider = ({ children }: React.PropsWithChildren) => {
   const SUPABASE_URL = import.meta.env.VITE_SERVICE_ROLE as string
   const SUPABASE_API_KEY = import.meta.env.VITE_API_KEY as string
   const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)
   const [user, setUser] = useState<unknown | null>(null)
   const [session, setSession] = useState<unknown | null>(null)

   const logoutFn = async () => {
      try {
         const { error } = await supabase.auth.signOut()
         if (error) {
            console.log(error)
            setUser(null)
            setSession(null)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const loginFn = async () => {
      try {
         const { data, error } = await supabase.auth.signInWithPassword({
            email: 'shanks-@gmx.de',
            password: 'Gf#124816',
         })
         if (!error) {
            setUser(data.session.user)
            setSession(data.session)
         }
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      console.log(user)
      console.log(session)
   },[user, session])

   return (
      <DatabaseContext.Provider value={{ test: 'string', loginFn, logoutFn }}>
         {children}
      </DatabaseContext.Provider>
   )
}

export default DatabaseContextProvider

export const useDatabaseContext = () => {
   return useContext(DatabaseContext)
}

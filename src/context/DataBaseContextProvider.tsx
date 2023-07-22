import { createContext, useContext, useEffect, useState } from 'react'
import { AuthError, Session, User, createClient } from '@supabase/supabase-js'
import Cookies from 'universal-cookie'

const cookie = new Cookies()

type CookieType = Session & { user: User }

interface DatabaseContextInterface {
   user: User | null
   session: Session | null
   loginFn: (e: string, p: string) => Promise<void>
   logoutFn: () => Promise<void>
   signUpFn: (e: string, p: string, u: string) => Promise<void>
   provideCookie: () => CookieType
   getCurrentSession: () => Promise<Session | null | undefined>
}
const SUPABASE_URL = import.meta.env.VITE_SERVICE_ROLE as string
const SUPABASE_API_KEY = import.meta.env.VITE_API_KEY as string
// eslint-disable-next-line react-refresh/only-export-components
export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)

const DatabaseContext = createContext<DatabaseContextInterface | null>(null)

const DatabaseContextProvider = ({ children }: React.PropsWithChildren) => {
   const pandaCookie = cookie.get('panda-weather-cookie') as CookieType
   const [user, setUser] = useState<User | null>(pandaCookie?.user ?? null)
   const [session, setSession] = useState<Session | null>(pandaCookie ?? null)
   const [supabaseError, setSupabaseError] = useState<AuthError | null>(
      null
   )

   const provideCookie = () => {
      return cookie.get('panda-weather-cookie') as CookieType
   }

   const logoutFn = async () => {
      try {
         const { error } = await supabase.auth.signOut()
         if (!error) {
            setUser(null)
            setSession(null)
            cookie.remove('panda-weather-cookie', { path: '/' })
         }
      } catch (error) {
         console.log(error)
      }
   }

   const loginFn = async (email: string, password: string) => {
      try {
         const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
         })
         if (!error) {
            cookie.set('panda-weather-cookie', data.session, {
               path: '/',
               maxAge: 60 * 60 * 10,
            })
            setUser(data?.session?.user)
            setSession(data?.session)
         } else {
            setSupabaseError(error)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const signUpFn = async (
      email: string,
      password: string,
      username: string
   ) => {
      try {
         const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
               data: {
                  username,
                  avatar: '',
               },
            },
         })
         if (!error) {
            console.log(data.session, data.user)
            const cookieValue = { ...data.session, user: data.user }
            console.log(cookieValue)
            cookie.set('panda-weather-cookie', cookieValue, {
               path: '/',
               maxAge: 60 * 60 * 10,
            })
            setUser(data?.user)
            setSession(data?.session)
         } else {
            setSupabaseError(error)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const getCurrentSession = async () => {
      try {
         const  { data, error } = await supabase.auth.getSession()
         if (data) {
            console.log(data)
            return data.session
         }
         setSupabaseError(error)
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      setTimeout(() => {
         setSupabaseError(null)
      }, 4000)
   }, [supabaseError])

   return (
      <DatabaseContext.Provider
         value={{
            user,
            session,
            loginFn,
            logoutFn,
            signUpFn,
            provideCookie,
            getCurrentSession,
         }}
      >
         {supabaseError ? (
            <div className='fixed top-10 left-1/2 text-white translate-x-[-50%] bg-red-800 p-5 z-[10000] rounded-lg'>
               {supabaseError?.status} : {supabaseError?.message}
            </div>
         ) : null}
         {children}
      </DatabaseContext.Provider>
   )
}

export default DatabaseContextProvider
// eslint-disable-next-line react-refresh/only-export-components
export const useDatabaseContext = () => {
   return useContext(DatabaseContext)
}
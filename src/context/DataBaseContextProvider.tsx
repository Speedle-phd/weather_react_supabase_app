import { createContext, useContext, useEffect, useState } from 'react'
import { AuthError, Session, User, createClient } from '@supabase/supabase-js'
import Cookies from 'universal-cookie'

const cookie = new Cookies()

export type CookieType = Session & { user: User }

interface DatabaseContextInterface {
   user: User | null
   username: string | null
   avatar: string | null
   session: Session | null
   loginFn: (e: string, p: string) => Promise<void>
   logoutFn: () => Promise<void>
   signUpFn: (e: string, p: string, u: string) => Promise<void>
   provideCookie: () => CookieType
   getCurrentSession: () => Promise<Session | null | undefined>
   deleteUser: (id: string) => Promise<void>
   changeUsername: (u: string) => void
   changeAvatar: (a: string) => void
}
const SUPABASE_URL = import.meta.env.VITE_URL as string
const SUPABASE_API_KEY = import.meta.env.VITE_API_KEY as string

// eslint-disable-next-line react-refresh/only-export-components
export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)
// export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

const DatabaseContext = createContext<DatabaseContextInterface | null>(null)

const DatabaseContextProvider = ({ children }: React.PropsWithChildren) => {
   const pandaCookie = cookie.get('panda-weather-cookie') as CookieType
   const [user, setUser] = useState<User | null>(pandaCookie?.user ?? null)
   const [session, setSession] = useState<Session | null>(pandaCookie ?? null)
   const [supabaseError, setSupabaseError] = useState<AuthError | null>(null)
   const [mount, setMount] = useState(true)
   const [username, setUsername] = useState<string | null>(null)
   const [avatar, setAvatar] = useState<string | null>(null)




   const changeUsername = (username: string) => {
      setUsername(username)
   }
   const changeAvatar = (newAvatar: string) => {
      setAvatar(newAvatar)
   }



   const provideCookie = () => {
      return cookie.get('panda-weather-cookie') as CookieType
   }

   const logoutFn = async () => {
      try {
         await supabase.auth.signOut()
      } catch (error) {
         console.log(error)
      }
   }

   const loginFn = async (email: string, password: string) => {
      try {
         const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
         })
         if (error) {
            setSupabaseError(error)
         }
      } catch (error) {
         console.log(error)
      }
   }
   const deleteUser = async (userId: string) => {
      try {
         await supabase.rpc('delete_user', { id: userId })
         await supabase.auth.signOut()
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
                  avatar:
                     'https://pubbsysucrloxsdbglwj.supabase.co/storage/v1/object/public/avatars/placeholder_avatar.jpg',
               },
            },
         })
         if (!error) {
            const cookieValue = { ...data.session, user: data.user }
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
   // TODO: check for expired cookies if logic works properly
   async function getCurrentSession() {
      try {
         const { data, error } = await supabase.auth.getSession()
         if (data) {
            const cookieValue = { ...data.session, user: data.session!.user }
            setSession(data.session)
            setUser(data.session!.user)
            cookie.set('panda-weather-cookie', cookieValue, {
               path: '/',
               maxAge: 60 * 60 * 10,
            })
            return data.session
         }
         setSupabaseError(error)
      } catch (error) {
         console.log(error)
      }
   }

   supabase.auth.onAuthStateChange((e, s) => {
      console.log(e)
      switch (e) {
         case 'INITIAL_SESSION':
            if (s && mount) {
               setSession(s)
               setUser(s.user)
               setMount(false)
            }
            break
         case 'SIGNED_IN':
            if (s) {
               setSession(s)
               setUser(s.user)
               cookie.set('panda-weather-cookie', s, {
                  path: '/',
                  maxAge: 60 * 60 * 10,
               })
            }
            break
         case 'SIGNED_OUT':
            setUser(null)
            setSession(null)
            cookie.remove('panda-weather-cookie', { path: '/' })
            break

         case 'TOKEN_REFRESHED':
            if (cookie.get('panda-weather-cookie') as CookieType) {
               cookie.remove('panda-weather-cookie', { path: '/' })
            }
            cookie.set('panda-weather-cookie', s, {
               path: '/',
               maxAge: 60 * 60 * 10,
            })
            break
      }
      //REFRESH_TOKEN, SIGNED_IN, SIGNED_OUT, USER_UPDATED, PASSWORD_RECOVERY
   })

   useEffect(() => {
      setTimeout(() => {
         setSupabaseError(null)
      }, 4000)
   }, [supabaseError])

   useEffect(() => {
      changeUsername(user?.user_metadata.username as string)
   }, [user])
   useEffect(() => {
      changeAvatar(user?.user_metadata.avatar as string)
   }, [user])


   return (
      <DatabaseContext.Provider
         value={{
            avatar,
            user,
            username,
            session,
            loginFn,
            logoutFn,
            signUpFn,
            provideCookie,
            getCurrentSession,
            deleteUser,
            changeUsername,
            changeAvatar,
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

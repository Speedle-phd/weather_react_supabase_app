import { Await, useLoaderData } from "react-router-dom"
import Underline from "../components/Underline"
import { Suspense } from "react"
import Loading from "../components/Loading"
import ChangeAvatar from "../components/ChangeAvatar"
import ChangeUsername from "../components/ChangeUsername"
import ChangePassword from "../components/ChangePassword"
import DeleteAccount from "../components/DeleteAccount"
import SettingsTile from "../components/SettingsTile"

interface settingsLoaderInterface {
   deferredData : {
      username: string
      avatar: string
      email: string
      userId: string
   }
}

const Settings = () => {
   const loaderData = useLoaderData()

   const renderHTML = ({deferredData: {username, avatar, email, userId}} : settingsLoaderInterface) => {
      console.log(loaderData)
      return (
         <section className='p-10 w-[clamp(25rem,70vw,80rem)] rounded-lg bg-slate-50/10 backdrop-blur-sm relative after:absolute after:inset-[0.5rem] after:border-slate-700/50 after:border-2 after:rounded-lg flex flex-col after:z-[-10]'>
            <h2 className='text-center text-3xl text-slate-800'>
               Weather the settings
            </h2>
            <Underline />
            <article className='my-10 bg-[rgba(255,255,255,0.6)] text-zinc-900 rounded-md min-h-[10rem] px-8 py-8 backdrop-blur-xl relative'>
               <h3 className="my-5 text-center text-2xl">Make a change</h3>
               {/* <p>{username}{avatar}</p> */}
               <div className="settings-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SettingsTile>
                     <ChangeAvatar />
                  </SettingsTile>
                  <SettingsTile>
                     <ChangeUsername />
                  </SettingsTile>
                  <SettingsTile>
                     <ChangePassword />
                  </SettingsTile>
                  <SettingsTile>
                     <DeleteAccount email={email} userId={userId}/>
                  </SettingsTile>
               </div>
            </article>
         </section>
      )
   }

   return (
   <Suspense fallback={<Loading />}>
      <Await resolve={loaderData}>
         {renderHTML}
      </Await>
   </Suspense>
   )
}

export default Settings

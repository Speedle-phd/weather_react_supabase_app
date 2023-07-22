import { useDatabaseContext } from './context/DataBaseContextProvider'
import { useWeatherContext } from './context/WeatherContextProvider'


const App = () => {
   const contextData = useWeatherContext()
   const db = useDatabaseContext()
   const session = db?.provideCookie()
   return (
      <>
         <div className='gap-4 font-thick text-lg font-bold flex flex-col justify-center items-center min-h-[100dvh] w-[max(20rem,_calc(100vw_-_4rem))] mx-auto'>
            <h2>Weather App</h2>
            <p>Hi {session?.user?.user_metadata?.username}</p>
            <p>Hi {db?.user?.user_metadata?.username}</p>
            <br />
            You are currently at the position:{' '}
            {JSON.stringify(contextData?.location)}
            <button className='btn-blue' onClick={db?.logoutFn}>
               Logout
            </button>
         </div>
      </>
   )
}

export default App

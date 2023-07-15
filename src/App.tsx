import { useDatabaseContext } from './context/DataBaseContextProvider'
import { useWeatherContext } from './context/WeatherContextProvider'

const App = () => {
   const contextData = useWeatherContext()
   const db = useDatabaseContext()
   return (
      <>
         <div className='font-thick text-lg font-bold flex justify-center items-center min-h-[100dvh] w-[max(20rem,_calc(100vw_-_4rem))] mx-auto'>
            Weather App
            <br />
            You are currently at the position:{' '}
            {JSON.stringify(contextData?.location)}
         </div>
         <button className='' onClick={db?.loginFn}>
            Login
         </button>
         <button className='' onClick={db?.logoutFn}>
            Logout
         </button>
      </>
   )
}

export default App

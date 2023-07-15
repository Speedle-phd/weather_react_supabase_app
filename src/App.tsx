import { useWeatherContext } from "./context/WeatherContextProvider"


const App = () => {
   const contextData = useWeatherContext() 
   return (
      <div className='font-bold text-teal-600 text-3xl flex justify-center items-center min-h-[100dvh] w-[max(20rem,_calc(100vw_-_4rem))] mx-auto'
      >
         Weather App
         <br />
         You are currently at the position: {JSON.stringify(contextData?.location)}
      </div>
   )
}

export default App

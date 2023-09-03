import { FiSunrise, FiSunset } from "react-icons/fi"
import WeatherIconValuePair from "./WeatherIconValuePair"
import { BsFillCloudRainFill } from "react-icons/bs"
import {FaCloudSunRain} from "react-icons/fa"
import { WiHumidity } from "react-icons/wi"
import {PiWindDuotone} from "react-icons/pi"
interface DayWeatherProps {
   date: string
   sunrise: string
   sunset: string
   tempMax: string
   tempMin: string
   icon: string
   description: string
   rain: string
   pop: string
   summary: string
   humidity: string
   windSpeed: string
}

const DayWeather = ({sunrise, sunset, date, tempMax, tempMin, icon, description, rain, pop, summary, humidity, windSpeed} : DayWeatherProps) => {
   return (
      <div style={{boxShadow: "2px 2px 10px 1px rgba(0,0,0,.6), 3px 3px 15px 2px rgba(0,0,0,.4"}} className='bg-stone-800/60 text-white p-6 relative rounded-lg after:inset-[3px] after:absolute after:border-[1px] after:rounded-lg flex justify-center items-center'>
         <h3 className='absolute top-2 left-3 text-gray-200/90 font-medium text-lg font-serif italic'>
            {date}
         </h3>
         <div className='grid gap-2'>
            <div className='flex flex-col items-center justify-center relative'>
               <img className="w-20"
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={"weather icon"}
               />
               <div className='text-[0.65rem] font-bold absolute bottom-0 left-[50%] translate-x-[-50%]'>
                  {description}
               </div>
            </div>
            <hr />
            <span className="text-[0.9rem] italic font-serif text-center leading-4">{summary}</span>
            <hr className="mb-2"/>
            <WeatherIconValuePair
               style={{ fontSize: '0.8rem' }}
               icon={'MAX'}
               iconValue={tempMax}
            />
            <WeatherIconValuePair
               style={{ fontSize: '0.8rem' }}
               icon={'MIN'}
               iconValue={tempMin}
            />
            <WeatherIconValuePair
               style={{ fontSize: '1.7rem' }}
               icon={<FiSunrise />}
               iconValue={sunrise}
            />
            <WeatherIconValuePair
               style={{ fontSize: '1.7rem' }}
               icon={<FiSunset />}
               iconValue={sunset}
            />
            <WeatherIconValuePair
               style={{ fontSize: '1.7rem' }}
               icon={<BsFillCloudRainFill />}
               iconValue={rain}
            />
            <WeatherIconValuePair
               style={{ fontSize: '1.7rem' }}
               icon={<FaCloudSunRain />}
               iconValue={pop}
            />
            <WeatherIconValuePair
               style={{ fontSize: '1.7rem' }}
               icon={<WiHumidity />}
               iconValue={humidity}
            />
            <WeatherIconValuePair
               style={{ fontSize: '1.7rem' }}
               icon={<PiWindDuotone />}
               iconValue={windSpeed}
            />
         </div>
      </div>
   )
}

export default DayWeather

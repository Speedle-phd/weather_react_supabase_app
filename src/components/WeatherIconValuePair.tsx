
interface WeatherIconValueProps extends React.ComponentPropsWithoutRef<'div'>{
   icon: React.ReactNode
   iconValue: string
}

const WeatherIconValuePair = ({icon, iconValue, ...props}: WeatherIconValueProps) => {
   return (
      <div
         className='text-3xl gap-2 flex items-center justify-center'
         {...props}
      >
         <div className='flex justify-between items-center px-2 gap-4 min-w-[10rem] leading-none'>
            {icon}
            <span className='text-xl leading-none flex-1 px-2'>{iconValue}</span>
         </div>
      </div>
   )
}

export default WeatherIconValuePair

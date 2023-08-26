
interface WeatherIconValueProps extends React.ComponentPropsWithoutRef<'div'>{
   icon: React.ReactNode
   iconValue: string
}

const WeatherIconValuePair = ({icon, iconValue, ...props}: WeatherIconValueProps) => {
   return <div className="text-3xl gap-2 flex items-center justify-center" {...props}>
      <div className="flex justify-start gap-4 min-w-[10rem]">{icon}<span className="text-2xl">{iconValue}</span></div>
   </div>
}

export default WeatherIconValuePair

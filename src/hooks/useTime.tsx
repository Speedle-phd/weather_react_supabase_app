import { useEffect, useState } from "react"


const useTime = (initialDate: Date) => {
   const [time, setTime] = useState<string>(initialDate.toLocaleTimeString().split(":")[0])

   const setTimeFn = (date: Date) => {
      setTime(date.toLocaleTimeString().split(":")[0])
   }

   useEffect(() => {
      const myInterval = setInterval(() => {
         setTimeFn(new Date())
      }, 1000 * 60 * 30)
      console.log(time)
      return () => clearInterval(myInterval)
   },[time])
   return [time, setTimeFn]
}

export default useTime

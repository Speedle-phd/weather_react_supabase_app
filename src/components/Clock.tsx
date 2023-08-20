import { useEffect, useState } from "react"

const Clock = () => {
   const [time, setTime] = useState(new Date().toLocaleTimeString())
   const [hours, minutes, seconds] = time.split(":")
   console.log(hours, minutes, seconds)


   function clockwork(){
      setTime(new Date().toLocaleTimeString())
   }

   useEffect(() => {
      const timeout = setTimeout(clockwork, 1000)
      return () => clearTimeout(timeout)
   }, [time])

   return <div className='mx-auto my-10'>{time}</div>
}

export default Clock

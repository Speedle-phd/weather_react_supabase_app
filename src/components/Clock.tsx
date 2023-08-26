import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface ClockProps {
   tzOffset?: number
   dt?: number
}
interface ClockValueInterface {
   [key: number]: number[]
}

const Clock = ({ tzOffset, dt }: ClockProps) => {
   const hourArmRef = useRef<HTMLDivElement | null>(null)
   const minuteArmRef = useRef<HTMLDivElement | null>(null)
   const secondArmRef = useRef<HTMLDivElement | null>(null)
   const clockRef = useRef<HTMLDivElement | null>(null)
   const dtRef = useRef(dt)
   const offsetRef = useRef(tzOffset)
   const [time, setTime] = useState(
      // new Date(tzOffset + dt * 1000).toLocaleTimeString()
      new Date().toLocaleTimeString()
   )

   
   const clockValue : ClockValueInterface = useMemo(() => {
      return {
         0: [0, 0],
         1: [1.5, 0.5],
         2: [2.5, 1.5],
         3: [3, 3],
         4: [2.5, 4.5],
         5: [1.5, 5.5],
         6: [0, 6],
         7: [-1.5, 5.5],
         8: [-2.5, 4.5],
         9: [-3, 3],
         10: [-2.5, 1.5],
         11: [-1.5, 0.5],
      }
   }, [])

   const clock = useCallback(() => {
      setTime(new Date().toLocaleTimeString())
      const [hours, minutes, secs] = time.split(':')
      
      const [rotateH, rotateM, rotateS] = convertRotation(
         +hours,
         +minutes,
         +secs
      )
      hourArmRef.current!.style.rotate = rotateH
      minuteArmRef.current!.style.rotate = rotateM
      secondArmRef.current!.style.rotate = rotateS
   }, [time])

   function convertRotation(h: number, m: number, s: number) {
      if (h > 12) {
         h -= 12
      }
      
      const rotateH =
         ((360 / 12) * h + ((m / 60) * 360) / 12 + 90).toString() + 'deg'
      const rotateM = ((360 / 60) * m + 90).toString() + 'deg'
      const rotateS = ((360 / 60) * s + 90).toString() + 'deg'
      return [rotateH, rotateM, rotateS]
   }

   const setGradients = useCallback(() => {
      for (let i = 0; i < 12; i++) {
         const g = document.createElement('div')
         g.classList.add('gradients')
         g.style.rotate = ((360 / 12) * i + 90).toString() + 'deg'
         g.style.translate = `${(clockValue[i][0] * Math.PI) / 2.36}rem ${
            (clockValue[i][1] * Math.PI) / 2.36
         }rem`
         clockRef.current!.append(g)
      }
   }, [clockValue])
   useEffect(() => {
      clock()
      setGradients()
   }, [setGradients, clock])

   useEffect(() => {
      const interval = setInterval(clock, 1000)
      return () => clearInterval(interval)
   }, [clock])

   // useEffect(() => {
   //    const timeout = setTimeout(() => {
   //       dtRef.current += 1
   //       setTime(new Date(tzOffset + dtRef.current * 1000).toLocaleTimeString())
   //    }, 1000)
   //    return () => clearTimeout(timeout)
   // }, [time, tzOffset, dt])

   return (
      <>
         <div ref={clockRef} className='clock mx-auto my-10'>
            <div className='armh' ref={hourArmRef}></div>
            <div className='armm' ref={minuteArmRef}></div>
            <div className='secs' ref={secondArmRef}></div>
         </div>
      </>
   )
}

export default Clock

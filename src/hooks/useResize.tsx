import {useState} from "react"

const useResize = () : [number, () => void] => {
   const [windowSize, setWindowSize] = useState<number>(window.innerWidth)
   function setSize(){
      setWindowSize(window.innerWidth)
   }
   return [windowSize, setSize]
}
export default useResize

// import { useRef } from 'react'
// import { useDatabaseContext } from '../context/DataBaseContextProvider'

// interface SetPositionProps {
//    preview: string
// }

// const SetPositionAvatar = ({ preview }: SetPositionProps) => {
//    const frameRef = useRef<HTMLElement | null>(null)
//    const positionRef = useRef<HTMLDivElement | null>(null)
//    const db = useDatabaseContext()

//    function setHeightWidth() {
//       const height = frameRef.current!.offsetHeight
//       const width = frameRef.current!.offsetWidth
//       console.log(height, width)
//       if (height > width) {
//          positionRef.current!.style.width = width.toString() + 'px'
//       } else {
//          positionRef.current!.style.width = height.toString() + 'px'
//       }
//    }

//    const handlePointerDown = (e: React.PointerEvent) => {
//       const draggable = positionRef.current!
//       const frame = frameRef.current!
//       draggable.setPointerCapture(e.pointerId)
//       const img = frame.firstElementChild as HTMLImageElement
//       const width = img.offsetWidth
//       const height = img.offsetHeight
//       const x = img.x
//       const y = img.y
//       const diameter = width < height ? width : height
//       console.log(diameter, x, y)
//       window.onpointermove = (ev: PointerEvent) => {
//          let imgYPosition: number | undefined
//          let imgXPosition: number | undefined
//          const { clientX: cx, clientY: cy } = ev
//          console.log('move')
//          if (cy - y + diameter / 2 < height && cy - y - diameter / 2 >= 0) {
//             const yInFrame = ((cy - y) / height) * 100
//             draggable.style.top = yInFrame.toString() + '%'
//             imgYPosition = ((cy - y - diameter / 2) / (height - diameter)) * 100
//          }
//          if (cx - x + diameter / 2 < width && cx - x - diameter / 2 >= 0) {
//             const xInFrame = ((cx - x) / width) * 100
//             draggable.style.left = xInFrame.toString() + '%'

//             imgXPosition = ((cx - x - diameter / 2) / (width - diameter)) * 100
//          }
//          db?.changeAvatarPosition(imgXPosition, imgYPosition)
//          window.onpointerup = (eve: PointerEvent) => {
//             console.log(imgXPosition, imgYPosition)
//             console.log('event ended')

//             window.onpointermove = null
//             draggable.releasePointerCapture(eve.pointerId)
//          }
//       }
//    }

//    return (
//       <figure
//          ref={frameRef}
//          className='w-[clamp(20rem,50vw,30rem)] relative isolate overflow-hidden'
//       >
//          <img
//             onLoad={setHeightWidth}
//             src={preview}
//             alt='preview new avatar'
//             className=''
//          />
//          <div
//             onPointerDown={handlePointerDown}
//             ref={positionRef}
//             className='aspect-square absolute bg-black/20 top-1/2 left-1/2 translate-x-[-50%] w-full translate-y-[-50%] z-10 cursor-grab rounded-full shadow-[0_0_0_100dvh_rgba(0,0,0,.7)]'
//          ></div>
//       </figure>
//    )
// }

// export default SetPositionAvatar

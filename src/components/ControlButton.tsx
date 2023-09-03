import React, { forwardRef } from 'react'

interface ControlButtonProps extends React.ComponentPropsWithRef<'button'> {
   children: React.ReactNode

}

const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
   ({ children, ...props }, ref) => {
      return (
         <button
            className='bg-zinc-700/70 text-white p-3 rounded-sm shadow-[inset_0_0_5px_1px_rgba(0,0,0,1),inset_0_0_10px_2px_rgba(0,0,0,0.5),inset_0_0_20px_4px_rgba(0,0,0,0.2)] transition
            hover:bg-zinc-600/0 focus-visible:bg-zinc-600/0 text-3xl md:text-xl
            
            '
            {...props}
            ref={ref}
         >
            {children}
         </button>
      )
   }
)

export default ControlButton

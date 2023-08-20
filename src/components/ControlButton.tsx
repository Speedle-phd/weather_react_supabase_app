import React, { forwardRef } from 'react'

interface ControlButtonProps extends React.ComponentPropsWithRef<'button'> {
   children: React.ReactNode

}

const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
   ({ children, ...props }, ref) => {
      return (
         <button
            className='bg-zinc-600 text-white p-3 shadow-[inset_0_0_5px_1px_rgba(0,0,0,1),inset_0_0_10px_2px_rgba(0,0,0,0.5),inset_0_0_20px_4px_rgba(0,0,0,0.2)]
            hover:opacity-80 focus-visible:opacity-80
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

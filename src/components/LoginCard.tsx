import React from 'react'
import thunder from '../assets/thunder.jpg'


const LoginCard = ({ children }: React.PropsWithChildren) => {
   return <div className='flex flex-col min-h-[100dvh]'>{children}</div>
}

LoginCard.Above = function ({ children }: React.PropsWithChildren) {
   return (
      <div
         style={{ backgroundImage: `url(${thunder})` }}
         className='h-72 bg-cover bg-[right_35%_bottom_40%]  bg-no-repeat shadow-whiteShadow'
      >
         {children}
      </div>
   )
}
LoginCard.Body = function ({ children }: React.PropsWithChildren) {
   return <div className='flex-grow'>{children}</div>
}
LoginCard.Below = function ({ children }: React.PropsWithChildren) {
   return (
      <div
         className={
            'text-center bg-zinc-900 h-10 flex flex-col justify-center opacity-40'
         }
      >
         {children}
      </div>
   )
}

export default LoginCard

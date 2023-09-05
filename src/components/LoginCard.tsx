import React from 'react'
import thunder from '../assets/thunder.jpg'


const LoginCard = ({ children }: React.PropsWithChildren) => {
   return (
      <div
         style={{ backgroundImage: `url(${thunder})` }}
         className='flex flex-col min-h-[100dvh] bg-cover bg-center'
      >
         {children}
      </div>
   )
}

LoginCard.Above = function ({ children }: React.PropsWithChildren) {
   return (
      <div
         
         className='h-72'
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

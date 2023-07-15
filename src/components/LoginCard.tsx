import React from 'react'

const LoginCard = ({children} : React.PropsWithChildren) => {
   return (
      <div>
         {children}
      </div>
   )
}

LoginCard.Above = function ({ children }: React.PropsWithChildren) {
   return <div>{children}</div>
}
LoginCard.Body = function ({ children }: React.PropsWithChildren) {
   return <div>{children}</div>
}
LoginCard.Below = function ({ children }: React.PropsWithChildren) {
   return <div>{children}</div>
}

export default LoginCard

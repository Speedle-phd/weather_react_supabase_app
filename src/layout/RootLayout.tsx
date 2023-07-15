import { Outlet } from 'react-router-dom'

const RootLayout = () => {
   return (
      <div>
         <h3>RootLayout</h3>
         <Outlet />
      </div>
   )
}

export default RootLayout

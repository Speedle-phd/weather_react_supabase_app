import { Navigate, Outlet } from 'react-router-dom'
import { useDatabaseContext } from '../context/DataBaseContextProvider'

const RootLayout = () => {
   const db = useDatabaseContext()
   return (
      <>
         {db?.user ? (
            <div>
               <h3>RootLayout</h3>
               <Outlet />
            </div>
         ) : (
            <Navigate to='/login'></Navigate>
         )}
      </>
   )
}

export default RootLayout

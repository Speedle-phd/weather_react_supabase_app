import { Outlet } from 'react-router-dom'
import LoginCard from '../components/LoginCard'

const AuthLayout = () => {
   return (
      <LoginCard>
         <LoginCard.Above>
            <h3>AuthLayout</h3>
         </LoginCard.Above>
         <LoginCard.Body>
         <Outlet />
         </LoginCard.Body>
         <LoginCard.Below>
            <h3>Below the Card</h3>
         </LoginCard.Below>
      </LoginCard>
   )
}



export default AuthLayout

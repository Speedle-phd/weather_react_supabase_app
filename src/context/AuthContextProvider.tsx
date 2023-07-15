import { createContext, useContext, useState } from "react"

interface AuthContextInterface {
  setUserFn: (u: string) => void
}

const AuthContext = createContext<AuthContextInterface | null>(null)

const AuthContextProvider = ({children} : React.PropsWithChildren) => {
  const [user, setUser] = useState<string | null>(null)

  const setUserFn = (u: string) => {
    setUser(u)
    console.log(user);
    
  }

  return (
    <AuthContext.Provider value={{setUserFn}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider

export const useAuthContext = () => {
  return useContext(AuthContext)
}
import {  useRouteError } from "react-router-dom"
import { ErrorType } from "../types/types"

const ErrorHandler = () => {
   const error = useRouteError() as ErrorType

  return (
    <div>
       {JSON.stringify(error)}
    </div>
  )
}

export default ErrorHandler

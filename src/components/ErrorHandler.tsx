import { useRouteError } from 'react-router-dom'
import { ErrorType } from '../types/types'

const ErrorHandler = () => {
   const error = useRouteError() as ErrorType
   console.log(error)
   return (
      <div className='min-h-[calc(100dvh-124px)]'>{JSON.stringify(error)}</div>
   )
}

export default ErrorHandler

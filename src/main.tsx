import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AuthContextProvider from './context/AuthContextProvider'
import WeatherContextProvider from './context/WeatherContextProvider'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import AuthLayout from './layout/AuthLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'

const router = createBrowserRouter([
   {
      path: '/',
      element: <RootLayout />,
      children: [
         {
            index: true,
            element: <App />,
         },
      ],
   },
   {
      element: <AuthLayout />,
      children: [
         {
            path: '/signup',
            element: <Signup />,
         },
         {
            path: '/login',
            element: <Login />,
         },
      ],
   },
   {
      path: '*',
      element: <h1>Not Found</h1>,
   },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <AuthContextProvider>
         <WeatherContextProvider>
            <RouterProvider router={router} />
         </WeatherContextProvider>
      </AuthContextProvider>
   </React.StrictMode>
)

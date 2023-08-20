import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import WeatherContextProvider from './context/WeatherContextProvider'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import AuthLayout from './layout/AuthLayout'
import Login from './pages/Login'
import DatabaseContextProvider from './context/DataBaseContextProvider'
import { appLoader, isLoggedIn, isNotLoggedIn } from './api/loader'


const router = createBrowserRouter([
   {
      path: '/',
      element: <RootLayout />,
      loader: isLoggedIn,
      children: [
         {
            index: true,
            element: <App />,
            loader: appLoader,
         },
      ],
   },
   {
      element: <AuthLayout />,
      loader: isNotLoggedIn,
      children: [
         {
            path: '/signup',
            element: <Login />,
            // loader: isNotLoggedIn,
         },
         {
            path: '/login',
            element: <Login />,
            // loader: isNotLoggedIn,
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
      <DatabaseContextProvider>
         <WeatherContextProvider>
            <RouterProvider router={router} />
         </WeatherContextProvider>
      </DatabaseContextProvider>
   </React.StrictMode>
)

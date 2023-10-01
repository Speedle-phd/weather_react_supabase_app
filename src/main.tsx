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
import { appLoader, detailLoader, isLoggedIn, isNotLoggedIn, locationLoader, settingsLoader } from './api/loader'
import ErrorHandler from './components/ErrorHandler'
import WeatherDetails from './pages/WeatherDetails'
import Locations from './pages/Locations'
import Settings from './pages/Settings'
import Reset from './pages/Reset'
import Restoring from './pages/Restoring'


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
            errorElement: <ErrorHandler/>
         },
         {
            path: 'details',
            element: <WeatherDetails />,
            loader: detailLoader,
            errorElement: <ErrorHandler />,
         },
         {
            path: 'locations',
            element: <Locations />,
            loader: locationLoader,
            errorElement: <ErrorHandler />,
         },
         {
            path: 'settings',
            element: <Settings />,
            loader: settingsLoader,
            errorElement: <ErrorHandler />,
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
         },
         {
            path: '/login',
            element: <Login />,
         },
         {
            path: '/reset',
            element: <Reset />,
         },
         {
            path: '/restoring_password',
            element: <Restoring />,
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

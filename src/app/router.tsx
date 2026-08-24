import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from '@/pages/home'
import { HotelPage } from '@/pages/hotel'
import { LoginPage } from '@/pages/login'
import { MyBookingsPage } from '@/pages/my-bookings'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/hotels/:id', element: <HotelPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/my-bookings', element: <MyBookingsPage /> },
    ],
  },
])

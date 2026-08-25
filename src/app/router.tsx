import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })))
const HotelPage = lazy(() => import('@/pages/hotel').then((m) => ({ default: m.HotelPage })))
const LoginPage = lazy(() => import('@/pages/login').then((m) => ({ default: m.LoginPage })))
const MyBookingsPage = lazy(() =>
  import('@/pages/my-bookings').then((m) => ({ default: m.MyBookingsPage })),
)
const MyPage = lazy(() => import('@/pages/my').then((m) => ({ default: m.MyPage })))
const WishlistPage = lazy(() => import('@/pages/wishlist').then((m) => ({ default: m.WishlistPage })))

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/hotels/:id', element: <HotelPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/my-bookings', element: <MyBookingsPage /> },
      { path: '/my', element: <MyPage /> },
      { path: '/wishlist', element: <WishlistPage /> },
    ],
  },
])

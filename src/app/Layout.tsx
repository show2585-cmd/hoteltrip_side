import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'

export function Layout() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <Outlet />
    </div>
  )
}

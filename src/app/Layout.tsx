import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { PageLoading } from '@/shared/ui/page-loading'

export function Layout() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

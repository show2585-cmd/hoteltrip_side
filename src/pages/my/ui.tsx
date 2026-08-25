import { Navigate, Link } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { Card, CardContent } from '@/shared/ui/card'

export function MyPage() {
  const { user, loading } = useSession()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">마이</h1>
      <Card className="mb-6">
        <CardContent>
          <p className="text-foreground">{user.email}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/wishlist"
          className="rounded-xl border border-border p-4 text-center text-sm text-foreground hover:bg-muted"
        >
          찜
        </Link>
        <Link
          to="/my-bookings"
          className="rounded-xl border border-border p-4 text-center text-sm text-foreground hover:bg-muted"
        >
          예약내역
        </Link>
      </div>
    </div>
  )
}

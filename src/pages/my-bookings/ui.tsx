import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { BookingCard, cancelBooking, fetchMyBookings, type BookingWithHotel } from '@/entities/booking'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'

export function MyBookingsPage() {
  const { user, loading: sessionLoading } = useSession()
  const [bookings, setBookings] = useState<BookingWithHotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    fetchMyBookings(user.id)
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : '예약 내역을 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [user])

  if (sessionLoading) return null
  if (!user) return <Navigate to="/login" replace />

  async function handleCancel(id: string) {
    await cancelBooking(id)
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">내 예약</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && bookings.length === 0 && <p className="text-muted-foreground">아직 예약이 없습니다.</p>}
      <div className="flex flex-col gap-4">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
          : bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
            ))}
      </div>
    </div>
  )
}

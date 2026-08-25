import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { fetchLikedHotels, unlikeHotel, HotelCard, type Hotel } from '@/entities/hotel'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'

export function WishlistPage() {
  const { user, loading: sessionLoading } = useSession()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    fetchLikedHotels(user.id)
      .then(setHotels)
      .catch((err) => setError(err instanceof Error ? err.message : '찜한 숙소를 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [user])

  if (sessionLoading) return null
  if (!user) return <Navigate to="/login" replace />

  async function handleUnlike(hotel: Hotel) {
    if (!user) return
    setHotels((prev) => prev.filter((h) => h.id !== hotel.id))
    try {
      await unlikeHotel(hotel.id, user.id)
    } catch {
      setHotels((prev) => [...prev, hotel])
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">찜한 숙소</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && hotels.length === 0 && (
        <p className="text-muted-foreground">아직 찜한 숙소가 없습니다.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)
          : hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} liked onToggleLike={handleUnlike} />
            ))}
      </div>
    </div>
  )
}

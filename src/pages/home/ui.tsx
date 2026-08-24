import { useEffect, useState } from 'react'
import { fetchHotels, HotelCard, type Hotel } from '@/entities/hotel'
import { BannerCarousel } from '@/widgets/banner-carousel'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'

export function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHotels()
      .then(setHotels)
      .catch((err) => setError(err instanceof Error ? err.message : '호텔 목록을 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <BannerCarousel />
      </div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">다음 여행지를 찾아보세요</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)
          : hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchHotelById, type Hotel } from '@/entities/hotel'
import { BookingForm } from '@/features/booking'
import { Card, CardContent } from '@/shared/ui/card'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'

export function HotelPage() {
  const { id } = useParams<{ id: string }>()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetchHotelById(id)
      .then(setHotel)
      .catch((err) => setError(err instanceof Error ? err.message : '호텔 정보를 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="mt-4 h-8 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <p className="text-muted-foreground">호텔을 찾을 수 없습니다.</p>
        <Link to="/" className="text-sm text-foreground underline">
          호텔 목록으로
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← 호텔 목록으로
      </Link>
      <Card className="mt-4 overflow-hidden">
        <img src={hotel.image_url} alt={hotel.name} className="h-64 w-full object-cover" />
        <CardContent>
          <h1 className="text-2xl font-semibold text-foreground">{hotel.name}</h1>
          <p className="text-muted-foreground">{hotel.location}</p>
          <p className="mt-3 text-foreground">{hotel.description}</p>
          <p className="mt-2 text-lg font-medium text-foreground">
            ₩{hotel.price_per_night.toLocaleString()}{' '}
            <span className="text-sm font-normal text-muted-foreground">/ 박</span>
          </p>
        </CardContent>
      </Card>
      <div className="mt-6">
        <BookingForm hotelId={hotel.id} />
      </div>
    </div>
  )
}

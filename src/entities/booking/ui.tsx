import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import type { BookingWithHotel } from './model'

export function BookingCard({
  booking,
  onCancel,
}: {
  booking: BookingWithHotel
  onCancel: (id: string) => void
}) {
  const nights = Math.round(
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <img
          src={booking.hotel.image_url}
          alt={booking.hotel.name}
          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{booking.hotel.name}</h3>
          <p className="text-sm text-muted-foreground">{booking.hotel.location}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {booking.check_in} → {booking.check_out} · {nights}박 · {booking.guests}명
          </p>
        </div>
        <Button variant="destructive" onClick={() => onCancel(booking.id)}>
          취소
        </Button>
      </CardContent>
    </Card>
  )
}

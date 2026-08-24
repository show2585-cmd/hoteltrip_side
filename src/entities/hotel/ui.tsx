import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/shared/ui/card'
import type { Hotel } from './model'

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link to={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden transition hover:shadow-md">
        <img src={hotel.image_url} alt={hotel.name} className="h-48 w-full object-cover" />
        <CardContent className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">{hotel.name}</h3>
          <p className="text-sm text-muted-foreground">{hotel.location}</p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{hotel.description}</p>
          <p className="mt-auto pt-3 text-base font-medium text-foreground">
            ₩{hotel.price_per_night.toLocaleString()}{' '}
            <span className="text-sm font-normal text-muted-foreground">/ 박</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import type { Hotel } from './model'

interface HotelCardProps {
  hotel: Hotel
  liked?: boolean
  onToggleLike?: (hotel: Hotel) => void
}

export function HotelCard({ hotel, liked = false, onToggleLike }: HotelCardProps) {
  return (
    <Link to={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden transition hover:shadow-md pt-0">
        <div className="relative">
          <img src={hotel.image_url} alt={hotel.name} className="h-48 w-full object-cover" />
          <button
            type="button"
            aria-label={liked ? '찜 해제' : '찜하기'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleLike?.(hotel)
            }}
            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background"
          >
            <Heart
              className={liked ? 'size-4 fill-destructive text-destructive' : 'size-4 text-foreground'}
            />
          </button>
        </div>
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

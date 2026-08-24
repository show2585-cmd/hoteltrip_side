import type { Hotel } from '@/entities/hotel'

export interface Booking {
  id: string
  user_id: string
  hotel_id: string
  check_in: string
  check_out: string
  guests: number
  created_at: string
}

export interface BookingWithHotel extends Booking {
  hotel: Hotel
}

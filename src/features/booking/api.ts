import { supabase } from '@/shared/api/supabase'

export async function createBooking(params: {
  userId: string
  hotelId: string
  checkIn: string
  checkOut: string
  guests: number
}) {
  const { error } = await supabase.from('bookings').insert({
    user_id: params.userId,
    hotel_id: params.hotelId,
    check_in: params.checkIn,
    check_out: params.checkOut,
    guests: params.guests,
  })
  if (error) throw error
}

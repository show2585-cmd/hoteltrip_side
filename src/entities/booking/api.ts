import { supabase } from '@/shared/api/supabase'
import type { BookingWithHotel } from './model'

export async function fetchMyBookings(userId: string): Promise<BookingWithHotel[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, hotel:hotels(*)')
    .eq('user_id', userId)
    .order('check_in')
  if (error) throw error
  return data as unknown as BookingWithHotel[]
}

export async function cancelBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) throw error
}

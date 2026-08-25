import { supabase } from '@/shared/api/supabase'
import type { Hotel } from './model'

interface FetchHotelsPageParams {
  query?: string
  offset: number
  limit: number
}

export async function fetchHotelsPage({ query = '', offset, limit }: FetchHotelsPageParams): Promise<Hotel[]> {
  let request = supabase
    .from('hotels')
    .select('*')
    .order('name')
    .range(offset, offset + limit - 1)

  const safeQuery = query.trim().replace(/[,()%]/g, '')
  if (safeQuery) {
    request = request.or(`name.ilike.%${safeQuery}%,location.ilike.%${safeQuery}%`)
  }

  const { data, error } = await request
  if (error) throw error
  return data
}

export async function fetchHotelById(id: string): Promise<Hotel | null> {
  const { data, error } = await supabase.from('hotels').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function fetchLikedHotelIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from('hotel_likes').select('hotel_id').eq('user_id', userId)
  if (error) throw error
  return data.map((row) => row.hotel_id)
}

export async function fetchLikedHotels(userId: string): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('hotel_likes')
    .select('hotel:hotels(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((row) => row.hotel) as unknown as Hotel[]
}

export async function likeHotel(hotelId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('hotel_likes').insert({ hotel_id: hotelId, user_id: userId })
  if (error) throw error
}

export async function unlikeHotel(hotelId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('hotel_likes')
    .delete()
    .eq('hotel_id', hotelId)
    .eq('user_id', userId)
  if (error) throw error
}

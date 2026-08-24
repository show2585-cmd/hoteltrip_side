import { supabase } from '@/shared/api/supabase'
import type { Hotel } from './model'

export async function fetchHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase.from('hotels').select('*').order('name')
  if (error) throw error
  return data
}

export async function fetchHotelById(id: string): Promise<Hotel | null> {
  const { data, error } = await supabase.from('hotels').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

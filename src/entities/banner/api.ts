import { supabase } from '@/shared/api/supabase'
import type { Banner } from './model'

export async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase.from('banners').select('*').order('sort_order')
  if (error) throw error
  return data
}

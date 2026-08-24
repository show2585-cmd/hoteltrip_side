import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { fetchBanners, type Banner } from '@/entities/banner'
import { Skeleton } from '@/shared/ui/skeleton'

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
      .then(setBanners)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton className="h-40 w-full rounded-xl sm:h-56" />
  if (banners.length === 0) return null

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={banners.length > 1}
      className="h-40 w-full overflow-hidden rounded-xl sm:h-56"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <img src={banner.image_url} alt="" className="h-full w-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

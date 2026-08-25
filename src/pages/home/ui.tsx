import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchHotelsPage, fetchLikedHotelIds, likeHotel, unlikeHotel, HotelCard, type Hotel } from '@/entities/hotel'
import { useSession } from '@/entities/session'
import { BannerCarousel } from '@/widgets/banner-carousel'
import { HotelSearchBar } from '@/widgets/hotel-search'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'

const INITIAL_PAGE_SIZE = 20
const MORE_PAGE_SIZE = 10

export function HomePage() {
  const { user } = useSession()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchHotelsPage({ query: searchQuery, offset: 0, limit: INITIAL_PAGE_SIZE })
      .then((data) => {
        setHotels(data)
        setHasMore(data.length === INITIAL_PAGE_SIZE)
      })
      .catch((err) => setError(err instanceof Error ? err.message : '호텔 목록을 불러오지 못했습니다'))
      .finally(() => setLoading(false))
  }, [searchQuery])

  useEffect(() => {
    if (loading || !hasMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || loadingMore) return
      setLoadingMore(true)
      fetchHotelsPage({ query: searchQuery, offset: hotels.length, limit: MORE_PAGE_SIZE })
        .then((data) => {
          setHotels((prev) => [...prev, ...data])
          setHasMore(data.length === MORE_PAGE_SIZE)
        })
        .catch((err) => setError(err instanceof Error ? err.message : '호텔 목록을 불러오지 못했습니다'))
        .finally(() => setLoadingMore(false))
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loading, loadingMore, hasMore, hotels.length, searchQuery])

  useEffect(() => {
    if (!user) {
      setLikedIds(new Set())
      return
    }
    fetchLikedHotelIds(user.id).then((ids) => setLikedIds(new Set(ids)))
  }, [user])

  async function handleToggleLike(hotel: Hotel) {
    if (!user) {
      navigate('/login')
      return
    }
    const wasLiked = likedIds.has(hotel.id)
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (wasLiked) next.delete(hotel.id)
      else next.add(hotel.id)
      return next
    })
    try {
      if (wasLiked) await unlikeHotel(hotel.id, user.id)
      else await likeHotel(hotel.id, user.id)
    } catch {
      setLikedIds((prev) => {
        const next = new Set(prev)
        if (wasLiked) next.add(hotel.id)
        else next.delete(hotel.id)
        return next
      })
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <BannerCarousel />
      </div>
      <div className="mb-6">
        <HotelSearchBar onSearch={setSearchQuery} />
      </div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">다음 여행지를 찾아보세요</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && hotels.length === 0 && (
        <p className="text-muted-foreground">검색 결과가 없습니다.</p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)
          : hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                liked={likedIds.has(hotel.id)}
                onToggleLike={handleToggleLike}
              />
            ))}
        {loadingMore &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`more-${i}`} className="h-80 w-full rounded-xl" />
          ))}
      </div>
      <div ref={sentinelRef} />
    </div>
  )
}

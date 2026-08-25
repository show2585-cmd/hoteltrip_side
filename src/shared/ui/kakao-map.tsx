import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

let sdkLoadPromise: Promise<void> | null = null

function loadKakaoMapSdk(appKey: string) {
  if (window.kakao?.maps) return Promise.resolve()
  if (!sdkLoadPromise) {
    sdkLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
      script.onload = () => window.kakao.maps.load(resolve)
      script.onerror = () => {
        sdkLoadPromise = null
        reject(new Error('카카오맵 SDK를 불러오지 못했습니다'))
      }
      document.head.appendChild(script)
    })
  }
  return sdkLoadPromise
}

interface KakaoMapProps {
  latitude: number
  longitude: number
  markerTitle?: string
  className?: string
}

export function KakaoMap({ latitude, longitude, markerTitle, className }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined

  useEffect(() => {
    if (!appKey || !containerRef.current) return
    let cancelled = false

    loadKakaoMapSdk(appKey).then(() => {
      if (cancelled || !containerRef.current) return
      const center = new window.kakao.maps.LatLng(latitude, longitude)
      const map = new window.kakao.maps.Map(containerRef.current, { center, level: 4 })
      new window.kakao.maps.Marker({ map, position: center, title: markerTitle })
    })

    return () => {
      cancelled = true
    }
  }, [appKey, latitude, longitude, markerTitle])

  if (!appKey) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">
          지도를 표시하려면 VITE_KAKAO_MAP_KEY 환경변수가 필요합니다.
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}

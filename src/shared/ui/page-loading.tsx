import { Loader2 } from 'lucide-react'

export function PageLoading() {
  return (
    <div className="flex min-h-[calc(100svh-73px)] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )
}

import { useState, type SubmitEvent } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'

interface HotelSearchBarProps {
  onSearch?: (query: string) => void
}

export function HotelSearchBar({ onSearch }: HotelSearchBarProps) {
  const [query, setQuery] = useState('')

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="지역, 숙소명으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button type="submit">검색</Button>
    </form>
  )
}

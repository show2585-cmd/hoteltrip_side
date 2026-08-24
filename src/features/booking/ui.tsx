import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import { useSession } from '@/entities/session'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Calendar } from '@/shared/ui/calendar'
import { createBooking } from './api'

export function BookingForm({ hotelId }: { hotelId: string }) {
  const { user } = useSession()
  const navigate = useNavigate()
  const [range, setRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!range?.from || !range?.to) {
      setError('체크인/체크아웃 날짜를 선택해주세요')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await createBooking({
        userId: user.id,
        hotelId,
        checkIn: format(range.from, 'yyyy-MM-dd'),
        checkOut: format(range.to, 'yyyy-MM-dd'),
        guests,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '문제가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Alert>
        <AlertDescription>
          예약이 완료되었습니다!{' '}
          <button type="button" onClick={() => navigate('/my-bookings')} className="font-medium underline">
            내 예약
          </button>
          에서 확인하세요.
        </AlertDescription>
      </Alert>
    )
  }

  const dateLabel =
    range?.from && range?.to
      ? `${format(range.from, 'M월 d일 (EEE)', { locale: ko })} → ${format(range.to, 'M월 d일 (EEE)', { locale: ko })}`
      : '날짜를 선택하세요'

  return (
    <Card>
      <CardHeader>
        <CardTitle>이 호텔 예약하기</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>체크인 · 체크아웃</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button type="button" variant="outline" className="w-fit justify-start font-normal">
                    {dateLabel}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  locale={ko}
                  selected={range}
                  onSelect={setRange}
                  disabled={{ before: new Date() }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="guests">인원</Label>
            <Input
              id="guests"
              type="number"
              required
              min={1}
              max={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-24"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={submitting}>
            {user ? (submitting ? '예약 중…' : '예약하기') : '로그인 후 예약하기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

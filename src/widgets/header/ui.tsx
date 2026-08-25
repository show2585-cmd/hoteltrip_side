import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '@/features/auth'
import { useSession } from '@/entities/session'
import { Button } from '@/shared/ui/button'

export function Header() {
  const { user } = useSession()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link to="/" className="text-lg font-semibold text-foreground">
        Stayfinder
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Button variant="link" render={<Link to="/my">마이</Link>} />
            <Button variant="link" render={<Link to="/wishlist">찜</Link>} />
            <Button variant="link" render={<Link to="/my-bookings">예약내역</Link>} />
            <span className="text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              로그아웃
            </Button>
          </>
        ) : (
          <Button render={<Link to="/login">로그인</Link>} />
        )}
      </nav>
    </header>
  )
}

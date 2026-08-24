import type { Session, User } from '@supabase/supabase-js'
import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/shared/api/supabase'

interface SessionContextValue {
  session: Session | null
  user: User | null
  loading: boolean
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </SessionContext>
  )
}

export function useSession() {
  const context = use(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}

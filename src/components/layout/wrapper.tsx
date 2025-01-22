"use client"

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/contexts/user-context'

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const pathname = usePathname()

  useEffect(() => {
    // Handle client-side redirects
    if (user && (pathname === '/' || pathname.startsWith('/auth'))) {
      window.location.href = '/dashboard'
    }
    if (!user && pathname.startsWith('/dashboard')) {
      window.location.href = '/auth/login'
    }
  }, [user, pathname])

  return children
}

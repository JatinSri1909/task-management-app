/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

type User = {
  id: string
  name: string
  email: string
}

type UserContextType = {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Sample user data
const SAMPLE_USER = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check both localStorage and cookies on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      Cookies.set('user', 'true', { expires: 7 }) // Set cookie for 7 days
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    if (email === SAMPLE_USER.email && password === SAMPLE_USER.password) {
      const userData = { id: SAMPLE_USER.id, name: SAMPLE_USER.name, email: SAMPLE_USER.email }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      Cookies.set('user', 'true', { expires: 7 })
      return true
    }
    return false
  }

  const signup = (name: string, email: string, password: string) => {
    const userData = { id: "2", name, email }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    Cookies.set('user', 'true', { expires: 7 })
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    Cookies.remove('user')
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <UserContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

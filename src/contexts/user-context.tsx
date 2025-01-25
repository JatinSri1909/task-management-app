/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { auth } from '../lib/api'

type User = {
  id: string
  email: string
}

type UserContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      Cookies.set('user', 'true', { expires: 7 })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await auth.login(email, password);
      if (token && user) {
        Cookies.set('token', token, { expires: 30 });
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error);
      return false;
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const { token, user } = await auth.signup(email, password);
      if (token && user) {
        Cookies.set('token', token, { expires: 30 });
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Signup failed:', error.response?.data?.message || error);
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    Cookies.remove('user')
  }

  if (isLoading) {
    return null
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

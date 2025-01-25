import { useState, useEffect, useCallback } from 'react'
import { useToast } from './use-toast'

interface PollingOptions<T> {
  interval: number
  fallbackData?: T
  enabled?: boolean
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: PollingOptions<T>
) {
  const { interval = 60000, fallbackData, enabled } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err: any) {
      console.error('Polling error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data'
      setError(errorMessage)
      
      if (!data && fallbackData) {
        setData(fallbackData)
        toast({
          variant: "destructive",
          title: "Error",
          description: `${errorMessage}. Using offline data.`,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [fetchFn, data, fallbackData, toast])

  useEffect(() => {
    fetch() // Initial fetch

    const intervalId = setInterval(fetch, interval)

    return () => clearInterval(intervalId)
  }, [fetch, interval])

  return { data, loading, error, refetch: fetch }
} 
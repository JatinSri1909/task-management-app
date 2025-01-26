import { useState, useEffect, useCallback } from 'react'
import { useToast } from './use-toast'

interface PollingOptions<T> {
  interval: number
  fallbackData?: T
}

interface PollingResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: PollingOptions<T>
): PollingResult<T> {
  const { interval = 60000, fallbackData } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetch = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (error: unknown) {
      console.error('Polling error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data'
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

  return {
    data: data || options.fallbackData || null,
    isLoading: loading,
    error: error ? new Error(error) : null,
    refetch: fetch
  }
} 
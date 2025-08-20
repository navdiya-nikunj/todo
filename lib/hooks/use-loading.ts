"use client"

import { useState, useCallback } from "react"

interface UseLoadingReturn {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>
}

export function useLoading(initialState = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])
  \
  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {\
  try {
    setIsLoading(true)
    return await asyncFn()
  } finally {
    setIsLoading(false)
  }
  \
}
, [])

return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
\
}

interface UseMultipleLoadingReturn {
  loadingStates: Record<string, boolean>
  isLoading: (key: string) => boolean
  startLoading: (key: string) => void
  stopLoading: (key: string) => void
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>
  isAnyLoading: boolean
}

export function useMultipleLoading(): UseMultipleLoadingReturn {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const isLoading = useCallback((key: string) => loadingStates[key] || false, [loadingStates])

  const startLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }))
  }, [])

  const stopLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }))
  }, [])
  \
  const withLoading = useCallback(async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {\
  try {
    startLoading(key)
    return await asyncFn()
  } finally {
    stopLoading(key)
  }
  \
}
, [startLoading, stopLoading])

const isAnyLoading = Object.values(loadingStates).some(Boolean)

return {
    loadingStates,
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    isAnyLoading,
  }
\
}

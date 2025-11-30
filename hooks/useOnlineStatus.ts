'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Connection restored')
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('No internet connection')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

import { createContext, useCallback, useEffect, useState } from 'react'
import { getUnreadCount } from '../api/notifications.service'

type NotificationsContextType = {
  unreadCount: number
  refreshUnread: () => void
  setUnreadCount: (count: number | ((current: number) => number)) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const pollInterval = 30 * 1000

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnread = useCallback(() => {
    getUnreadCount()
      .then(res => setUnreadCount(res.data.count))
      .catch(error => console.error('Failed to fetch notifications', error))
  }, [])

  useEffect(() => {
    refreshUnread()

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') refreshUnread()
    }, pollInterval)

    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshUnread()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refreshUnread])

  return (
    <NotificationsContext.Provider value={{ unreadCount, refreshUnread, setUnreadCount }}>
      {children}
    </NotificationsContext.Provider>
  )
}

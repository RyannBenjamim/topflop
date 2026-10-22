import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import Button from '../../../components/Button/Button'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import NotificationItem from './components/NotificationItem/NotificationItem'
import { findAll, markAllAsRead, markAsRead } from '../../../api/notifications.service'
import { useNotifications } from '../../../hooks/useNotifications'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { Notification } from '../../../types/notifications'
import { getErrorMessage } from '../../../utils/requestError'

const Notifications = () => {
  const { unreadCount, setUnreadCount, refreshUnread } = useNotifications()
  const [notifications, setNotifications] = useState<Notification[] | null>(null)
  const [error, setError] = useState('')
  const [isMarking, setIsMarking] = useState(false)

  const movies = useTmdbMovies(
    (notifications ?? []).filter(item => item.type === 'NEW_REVIEW').map(item => item.review?.movieTmdbId)
  )

  useEffect(() => {
    findAll()
      .then(res => {
        setNotifications(res.data)
        refreshUnread()
      })
      .catch(error => {
        setNotifications([])
        setError(getErrorMessage(error))
      })
  }, [refreshUnread])

  const handleOpen = (notification: Notification) => {
    if (notification.read) return

    setNotifications(current => current?.map(item => item.id === notification.id ? { ...item, read: true } : item) ?? null)
    setUnreadCount(count => Math.max(count - 1, 0))
    markAsRead(notification.id).catch(error => console.error('Failed to mark the notification as read', error))
  }

  const handleMarkAll = async () => {
    setIsMarking(true)
    try {
      await markAllAsRead()
      setNotifications(current => current?.map(item => ({ ...item, read: true })) ?? null)
      setUnreadCount(0)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsMarking(false)
    }
  }

  const hasUnread = notifications?.some(item => !item.read) ?? false

  return (
    <div className={styles.page}>
      <Center>
        <div className={styles.header}>
          <div>
            <h2>Notificações</h2>
            <p>{unreadCount > 0 ? `${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}` : 'Tudo em dia por aqui.'}</p>
          </div>

          {hasUnread && (
            <Button variant="ghost" icon="fa-solid fa-check-double" isLoading={isMarking} onClick={handleMarkAll}>
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {notifications === null && <Spinner />}
        {error && <CardMessage text={error} />}
        {notifications && !error && notifications.length === 0 && (
          <CardMessage text="Você ainda não tem notificações. Quando alguém seguir você, curtir ou comentar suas reviews, aparece aqui." />
        )}

        {notifications && notifications.length > 0 && (
          <div className={styles.list}>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                movie={notification.review ? movies[notification.review.movieTmdbId] : undefined}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </Center>
    </div>
  )
}

export default Notifications

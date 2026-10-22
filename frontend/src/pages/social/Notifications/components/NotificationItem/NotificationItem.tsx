import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Avatar from '../../../../../components/Avatar/Avatar'
import type { Notification } from '../../../../../types/notifications'
import type { TmdbMovie } from '../../../../../types/tmdb'
import { formatRelativeTime } from '../../../../../utils/formatRelativeTime'

interface NotificationItemProps {
  notification: Notification
  movie?: TmdbMovie
  onOpen: (notification: Notification) => void
}

const icons: Record<Notification['type'], string> = {
  FOLLOW: 'fa-user-plus',
  REVIEW_LIKE: 'fa-heart',
  COMMENT_LIKE: 'fa-heart',
  REVIEW_COMMENT: 'fa-comment',
  NEW_REVIEW: 'fa-pen',
}

const linkOf = ({ type, actor, review }: Notification) => {
  if (type === 'FOLLOW' || !review) return `/perfil/${actor.username}`
  return `/reviews/${review.id}`
}

const describe = ({ type, review }: Notification, movie?: TmdbMovie) => {
  const title = review ? <strong>“{review.title}”</strong> : null

  switch (type) {
    case 'FOLLOW':
      return <>começou a seguir você.</>
    case 'REVIEW_LIKE':
      return <>curtiu sua review {title}.</>
    case 'COMMENT_LIKE':
      return <>curtiu seu comentário em {title}.</>
    case 'REVIEW_COMMENT':
      return <>comentou na sua review {title}.</>
    case 'NEW_REVIEW':
      return movie
        ? <>publicou uma review de <strong>{movie.title}</strong>: {title}.</>
        : <>publicou uma nova review: {title}.</>
  }
}

const NotificationItem = ({ notification, movie, onOpen }: NotificationItemProps) => {
  const { actor, comment, createdAt, read, type } = notification
  const actorName = actor.name || actor.username

  return (
    <Link
      to={linkOf(notification)}
      className={`${styles.item} ${read ? '' : styles.unread}`}
      onClick={() => onOpen(notification)}
    >
      <span className={styles.avatar}>
        <Avatar name={actorName} size="medium" />
        <span className={`${styles.icon} ${styles[type.toLowerCase()]}`}>
          <i className={`fa-solid ${icons[type]}`}></i>
        </span>
      </span>

      <span className={styles.content}>
        <span className={styles.text}>
          <strong>{actorName}</strong> {describe(notification, movie)}
        </span>
        {type === 'REVIEW_COMMENT' && comment && <span className={styles.excerpt}>{comment.excerpt}</span>}
        <time dateTime={createdAt}>{formatRelativeTime(createdAt)}</time>
      </span>

      {!read && <span className={styles.dot} aria-label="Não lida"></span>}
    </Link>
  )
}

export default NotificationItem

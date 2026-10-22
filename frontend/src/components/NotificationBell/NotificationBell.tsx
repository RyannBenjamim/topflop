import { NavLink } from 'react-router-dom'
import styles from './styles.module.css'
import { useNotifications } from '../../hooks/useNotifications'

const NotificationBell = ({ className }: { className?: string }) => {
  const { unreadCount } = useNotifications()
  const label = unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : 'Notificações'

  return (
    <NavLink
      to="/notificacoes"
      className={({ isActive }) => `${styles.bell} ${isActive ? styles.active : ''} ${className ?? ''}`}
      title="Notificações"
      aria-label={label}
    >
      <i className="fa-solid fa-bell"></i>
      {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
    </NavLink>
  )
}

export default NotificationBell

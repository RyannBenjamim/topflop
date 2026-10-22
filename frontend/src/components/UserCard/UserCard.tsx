import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Avatar from '../Avatar/Avatar'
import type { UserSummary } from '../../types/users'

interface UserCardProps {
  user: UserSummary
  subtitle?: string
  children?: ReactNode
}

const UserCard = ({ user, subtitle, children }: UserCardProps) => {
  const displayName = user.name || user.username

  return (
    <div className={styles.wrapper}>
      <Link className={styles.link} to={`/perfil/${user.username}`}>
        <Avatar name={displayName} />
        <div className={styles.infos}>
          <p className={styles.name}>{displayName}</p>
          <p className={styles.username}>@{user.username}{subtitle && ` · ${subtitle}`}</p>
        </div>
      </Link>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}

export default UserCard

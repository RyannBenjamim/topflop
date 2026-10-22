import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'

interface ReviewsShellProps {
  back: { to: string, label: string }
  title: string
  subtitle?: ReactNode
  media?: ReactNode
  children: ReactNode
}

const ReviewsShell = ({ back, title, subtitle, media, children }: ReviewsShellProps) => {
  return (
    <div className={styles.page}>
      <Center>
        <Link to={back.to} className={styles.back}>
          <i className="fa-solid fa-arrow-left"></i> {back.label}
        </Link>

        <header className={styles.header}>
          {media}
          <div className={styles.heading}>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </Center>
    </div>
  )
}

export default ReviewsShell

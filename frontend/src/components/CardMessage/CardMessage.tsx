import type { ReactNode } from 'react'
import styles from './styles.module.css'

interface CardMessageProps {
  text: string
  children?: ReactNode
}

const CardMessage = ({ text, children }: CardMessageProps) => {
  return (
    <div className={styles.wrapper}>
      <p>{text}</p>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}

export default CardMessage

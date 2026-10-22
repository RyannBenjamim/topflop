import type { ReactNode } from 'react'
import styles from './styles.module.css'

const icons = {
  error: 'fa-circle-exclamation',
  success: 'fa-circle-check',
  info: 'fa-circle-info',
}

interface AlertProps {
  type?: 'error' | 'success' | 'info'
  children?: ReactNode
}

const Alert = ({ type = 'error', children }: AlertProps) => {
  if (!children) return null

  return (
    <div className={`${styles.alert} ${styles[type]}`} role={type === 'error' ? 'alert' : 'status'}>
      <i className={`fa-solid ${icons[type]}`}></i>
      <div>{children}</div>
    </div>
  )
}

export default Alert

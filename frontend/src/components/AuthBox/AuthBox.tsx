import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Logo from '../Logo/Logo'

interface AuthBoxProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

const AuthBox = ({ title, subtitle, children, footer }: AuthBoxProps) => {
  return (
    <main className={styles.page}>
      <div className={styles.box}>
        <Link to="/" className={styles.logo}>
          <Logo size="medium" />
        </Link>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </main>
  )
}

export default AuthBox

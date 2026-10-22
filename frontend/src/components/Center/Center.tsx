import type { ReactNode } from 'react'
import styles from './styles.module.css'

const Center = ({ children }: { children: ReactNode }) => {
  return <div className={styles.center}>{children}</div>
}

export default Center

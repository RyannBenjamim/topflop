import styles from './styles.module.css'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const Logo = ({ size = 'medium', className }: LogoProps) => {
  return (
    <span className={`${styles.logo} ${styles[size]} ${className ?? ''}`} aria-label="TopFlop">
      <span className={styles.top} aria-hidden="true">Top</span>
      <span className={styles.flop} aria-hidden="true">Flop</span>
    </span>
  )
}

export default Logo

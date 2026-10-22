import styles from './styles.module.css'

const tierOf = (value: number) => {
  if (value >= 70) return 'top'
  if (value >= 50) return 'mid'
  return 'flop'
}

interface TopBadgeProps {
  value: number
  title?: string
}

const TopBadge = ({ value, title }: TopBadgeProps) => {
  const rounded = Math.round(value)
  const tier = tierOf(rounded)

  return (
    <span className={`${styles.badge} ${styles[tier]}`} title={title}>
      <i className={`fa-solid ${tier === 'flop' ? 'fa-arrow-trend-down' : 'fa-arrow-trend-up'}`}></i>
      {rounded}% {tier === 'flop' ? 'Flop' : 'Top'}
    </span>
  )
}

export default TopBadge

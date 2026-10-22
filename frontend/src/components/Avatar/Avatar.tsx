import styles from './styles.module.css'
import { getInitials } from '../../utils/getInitials'

const colors = ['#2E3338', '#4A3B22', '#3A3F45', '#5C4724', '#33302B', '#454B52']

const colorFor = (name = '') => {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0)
  return colors[sum % colors.length]
}

interface AvatarProps {
  name?: string | null
  size?: 'small' | 'medium' | 'large'
}

const Avatar = ({ name, size = 'medium' }: AvatarProps) => {
  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      style={{ backgroundColor: colorFor(name ?? '') }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}

export default Avatar

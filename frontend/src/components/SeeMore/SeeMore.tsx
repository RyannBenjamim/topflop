import { Link } from 'react-router-dom'
import styles from './styles.module.css'

interface SeeMoreProps {
  to: string
  text?: string
  total?: number
}

const SeeMore = ({ to, text = 'Ver mais reviews', total }: SeeMoreProps) => {
  return (
    <Link to={to} className={styles.more}>
      {text}
      {total !== undefined && <span>{total}</span>}
      <i className="fa-solid fa-arrow-right"></i>
    </Link>
  )
}

export default SeeMore

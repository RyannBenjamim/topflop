import { Link } from 'react-router-dom'
import styles from './styles.module.css'

interface CardProps {
  img: string
  id: number
  title?: string
}

const Card = ({ img, id, title }: CardProps) => {
  return (
    <Link to={`/filmes/${id}`} title={title}>
      <div className={styles.card}>
        <img src={img} alt={title ? `Pôster de ${title}` : 'Pôster'} loading="lazy" decoding="async" />
      </div>
    </Link>
  )
}

export default Card

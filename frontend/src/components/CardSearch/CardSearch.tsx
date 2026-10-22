import type { ReactNode, SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import { formatReleaseDate } from '../../utils/formatReleaseDate'
import { posterDefault } from '../../utils/tmdbImages'

interface CardSearchProps {
  id: number
  img?: string
  title: string
  data?: string | null
  plot?: string
  children?: ReactNode
}

const CardSearch = ({ id, img, title, data, plot, children }: CardSearchProps) => {
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (!e.currentTarget.src.endsWith(posterDefault)) e.currentTarget.src = posterDefault
  }

  return (
    <div className={styles.wrapper}>
      <Link className={styles.link} to={`/filmes/${id}`}>
        <img
          src={img ?? posterDefault}
          alt={`Pôster de ${title}`}
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
        <div className={styles.infos}>
          <p className={styles.title}>{title}</p>
          <p className={styles.data}>{formatReleaseDate(data)}</p>
          <p className={styles.plot}>{plot}</p>
        </div>
      </Link>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}

export default CardSearch

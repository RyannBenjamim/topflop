import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Avatar from '../Avatar/Avatar'
import TopBadge from '../TopBadge/TopBadge'
import type { ReviewSummary } from '../../types/reviews'
import type { UserSummary } from '../../types/users'
import type { TmdbMovie } from '../../types/tmdb'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import { getReleaseYear } from '../../utils/formatReleaseDate'
import { getPosterUrl, posterDefault } from '../../utils/tmdbImages'

interface ReviewCardProps {
  review: ReviewSummary
  movie?: TmdbMovie
  author?: UserSummary
  showMovie?: boolean
  showAuthor?: boolean
}

const ReviewCard = ({ review, movie, author, showMovie = false, showAuthor = false }: ReviewCardProps) => {
  const authorName = author ? author.name || author.username : 'Usuário do TopFlop'

  return (
    <article className={styles.wrapper}>
      <Link to={`/reviews/${review.id}`} className={styles.overlay} aria-label={`Ler a review "${review.title}"`} />

      {showMovie && (
        <div className={styles.poster}>
          <img src={getPosterUrl(movie?.poster_path, 'w185') ?? posterDefault} alt={movie ? `Pôster de ${movie.title}` : 'Pôster'} loading="lazy" decoding="async" />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.top_row}>
          <div className={styles.heading}>
            {showMovie && (
              <p className={styles.movie}>
                {movie ? movie.title : 'Carregando filme...'}
                {movie?.release_date && <span> · {getReleaseYear(movie.release_date)}</span>}
              </p>
            )}

            <h4 className={styles.title}>{review.title}</h4>
          </div>

          <TopBadge value={review.topPercentage} />
        </div>

        {review.excerpt && (
          <p className={styles.excerpt}>{review.excerpt}</p>
        )}

        <div className={styles.footer}>
          {showAuthor && (
            <span className={styles.author}>
              <Avatar name={authorName} size="small" />
              <span>{authorName}</span>
            </span>
          )}

          {review.createdAt && (
            <time className={styles.date} dateTime={review.createdAt}>{formatRelativeTime(review.createdAt)}</time>
          )}

          <span className={styles.read} aria-hidden="true">
            Ler review <i className="fa-solid fa-angle-right"></i>
          </span>
        </div>
      </div>
    </article>
  )
}

export default ReviewCard

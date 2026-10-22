import styles from './styles.module.css'
import ReviewCard from '../ReviewCard/ReviewCard'
import Pagination from '../Pagination/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useTmdbMovies } from '../../hooks/useTmdbMovies'
import { useUsersDirectory } from '../../hooks/useUsersDirectory'
import type { ReviewSummary } from '../../types/reviews'

export const reviewsPageSize = 10

interface PagedReviewsProps {
  reviews: ReviewSummary[]
  showMovie?: boolean
  showAuthor?: boolean
}

const PagedReviews = ({ reviews, showMovie = false, showAuthor = false }: PagedReviewsProps) => {
  const { page, totalPages, total, pageItems, goTo } = usePagination(reviews, reviewsPageSize)
  const movies = useTmdbMovies(showMovie ? pageItems.map(review => review.movieTmdbId) : [])
  const users = useUsersDirectory()

  const first = (page - 1) * reviewsPageSize + 1
  const last = first + pageItems.length - 1

  return (
    <div className={styles.wrapper}>
      <p className={styles.range}>
        {total === 1 ? '1 review' : `Mostrando ${first}–${last} de ${total} reviews`}
      </p>

      <div className={styles.list}>
        {pageItems.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            movie={movies[review.movieTmdbId]}
            author={users[review.authorId]}
            showMovie={showMovie}
            showAuthor={showAuthor}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={goTo} />
    </div>
  )
}

export default PagedReviews

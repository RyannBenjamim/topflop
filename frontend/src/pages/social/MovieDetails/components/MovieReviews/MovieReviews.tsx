import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import Button from '../../../../../components/Button/Button'
import CardMessage from '../../../../../components/CardMessage/CardMessage'
import ReviewCard from '../../../../../components/ReviewCard/ReviewCard'
import ReviewForm from '../../../../../components/ReviewForm/ReviewForm'
import SeeMore from '../../../../../components/SeeMore/SeeMore'
import Spinner from '../../../../../components/Spinner/Spinner'
import { useAuth } from '../../../../../hooks/useAuth'
import { useUsersDirectory } from '../../../../../hooks/useUsersDirectory'
import { create } from '../../../../../api/reviews.service'
import type { ReviewFormValues, ReviewSummary } from '../../../../../types/reviews'
import { isRequestError } from '../../../../../utils/requestError'

const previewSize = 3

interface MovieReviewsProps {
  tmdbId: number
  reviews: ReviewSummary[] | null
  error: string
  onChange: () => void
}

const MovieReviews = ({ tmdbId, reviews, error, onChange }: MovieReviewsProps) => {
  const { user } = useAuth()
  const users = useUsersDirectory()
  const navigate = useNavigate()
  const [isWriting, setIsWriting] = useState(false)

  const myReview = reviews?.find(review => review.authorId === user?.id)

  const handleCreate = async (values: ReviewFormValues) => {
    try {
      const response = await create({ ...values, movieTmdbId: tmdbId })
      onChange()
      navigate(`/reviews/${response.data.id}`)
    } catch (error) {
      if (isRequestError(error) && error.errorCode === 'UNIQUE_CONSTRAINT') {
        throw new Error('Você já publicou uma review para este filme.')
      }
      throw error
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3>Reviews do TopFlop {reviews && reviews.length > 0 && <span>{reviews.length}</span>}</h3>

        {reviews && !myReview && !isWriting && (
          <Button variant="accent" icon="fa-solid fa-pen" onClick={() => setIsWriting(true)}>Escrever review</Button>
        )}

        {myReview && (
          <Link className={styles.mine} to={`/reviews/${myReview.id}`}>
            Ver a sua review <i className="fa-solid fa-angle-right"></i>
          </Link>
        )}
      </div>

      {isWriting && (
        <div className={styles.form}>
          <ReviewForm onSubmit={handleCreate} onCancel={() => setIsWriting(false)} />
        </div>
      )}

      {reviews === null && <Spinner />}
      {error && <CardMessage text={error} />}
      {reviews && !error && reviews.length === 0 && !isWriting && (
        <CardMessage text="Ninguém avaliou este filme ainda. Que tal ser o primeiro?" />
      )}

      {reviews && reviews.length > 0 && (
        <div className={styles.list}>
          {reviews.slice(0, previewSize).map(review => (
            <ReviewCard key={review.id} review={review} author={users[review.authorId]} showAuthor />
          ))}

          {reviews.length > previewSize && (
            <SeeMore to={`/filmes/${tmdbId}/reviews`} text="Ver todas as reviews" total={reviews.length} />
          )}
        </div>
      )}
    </section>
  )
}

export default MovieReviews

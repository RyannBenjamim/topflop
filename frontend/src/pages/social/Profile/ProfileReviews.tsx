import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styles from './styles/profile-reviews.module.css'
import ReviewCard from '../../../components/ReviewCard/ReviewCard'
import CardMessage from '../../../components/CardMessage/CardMessage'
import SeeMore from '../../../components/SeeMore/SeeMore'
import Spinner from '../../../components/Spinner/Spinner'
import { findByAuthor } from '../../../api/reviews.service'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { ReviewSummary } from '../../../types/reviews'
import type { ProfileOutletContext } from '../../../types/users'

const previewSize = 6

const ProfileReviews = () => {
  const { profileUser, isMyProfile } = useOutletContext<ProfileOutletContext>()
  const [reviews, setReviews] = useState<ReviewSummary[] | null>(null)

  const preview = (reviews ?? []).slice(0, previewSize)
  const movies = useTmdbMovies(preview.map(review => review.movieTmdbId))

  useEffect(() => {
    findByAuthor(profileUser.id)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]))
  }, [profileUser.id])

  if (!reviews) return <Spinner />

  if (reviews.length === 0) {
    const name = profileUser.name || profileUser.username
    return <CardMessage text={isMyProfile ? 'Você ainda não publicou reviews.' : `${name} ainda não publicou reviews.`} />
  }

  return (
    <div className={styles.list}>
      {preview.map(review => (
        <ReviewCard key={review.id} review={review} movie={movies[review.movieTmdbId]} showMovie />
      ))}

      {reviews.length > previewSize && (
        <SeeMore to={`/perfil/${profileUser.username}/reviews`} text="Ver todas as reviews" total={reviews.length} />
      )}
    </div>
  )
}

export default ProfileReviews

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './styles.module.css'
import ReviewsShell from './ReviewsShell'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import PagedReviews from '../../../components/PagedReviews/PagedReviews'
import { findByMovie } from '../../../api/reviews.service'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { ReviewSummary } from '../../../types/reviews'
import { getReleaseYear } from '../../../utils/formatReleaseDate'
import { getErrorMessage } from '../../../utils/requestError'
import { getPosterUrl, posterDefault } from '../../../utils/tmdbImages'

const AllMovieReviews = () => {
  const { tmdb_id } = useParams<{ tmdb_id: string }>()
  const tmdbId = Number(tmdb_id)
  const isValidId = Number.isInteger(tmdbId) && tmdbId > 0
  const [reviews, setReviews] = useState<ReviewSummary[] | null>(null)
  const [error, setError] = useState('')

  const movie = useTmdbMovies(isValidId ? [tmdbId] : [])[tmdbId]

  useEffect(() => {
    if (!isValidId) return

    let isMounted = true

    findByMovie(tmdbId)
      .then(res => { if (isMounted) setReviews(res.data) })
      .catch(error => {
        if (!isMounted) return
        setReviews([])
        setError(getErrorMessage(error))
      })

    return () => {
      isMounted = false
    }
  }, [tmdbId, isValidId])

  const year = movie?.release_date ? getReleaseYear(movie.release_date) : ''

  return (
    <ReviewsShell
      back={{ to: `/filmes/${tmdb_id}`, label: 'Voltar para o filme' }}
      title={movie ? `Reviews de ${movie.title}` : 'Reviews do filme'}
      subtitle={year ? `Filme de ${year}` : undefined}
      media={(
        <img
          className={styles.poster}
          src={getPosterUrl(movie?.poster_path, 'w185') ?? posterDefault}
          alt={movie ? `Pôster de ${movie.title}` : 'Pôster'}
        />
      )}
    >
      {!isValidId && <CardMessage text="O endereço desse filme é inválido." />}
      {isValidId && reviews === null && <Spinner />}
      {error && <CardMessage text={error} />}
      {reviews && !error && reviews.length === 0 && <CardMessage text="Ninguém avaliou este filme ainda." />}
      {reviews && reviews.length > 0 && <PagedReviews reviews={reviews} showAuthor />}
    </ReviewsShell>
  )
}

export default AllMovieReviews

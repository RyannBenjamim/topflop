import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Carousel from '../../../components/Carousel/Carousel'
import MovieInfo from './components/MovieInfo/MovieInfo'
import VideoBox from './components/VideoBox/VideoBox'
import MovieReviews from './components/MovieReviews/MovieReviews'
import { getMovie, getSimilar } from '../../../api/tmdb/tmdb.service'
import { findOne } from '../../../api/cinema/movies.service'
import { findByMovie } from '../../../api/reviews.service'
import { useImageLoader } from '../../../hooks/useImageLoader'
import type { TmdbMovie, TmdbMovieDetails } from '../../../types/tmdb'
import type { Movie } from '../../../types/movies'
import type { ReviewSummary } from '../../../types/reviews'
import { getErrorMessage } from '../../../utils/requestError'
import { getPosterUrl, posterDefault } from '../../../utils/tmdbImages'

const MovieDetails = () => {
  const { tmdb_id } = useParams<{ tmdb_id: string }>()
  const tmdbId = Number(tmdb_id)
  const isValidId = Number.isInteger(tmdbId) && tmdbId > 0

  const [movie, setMovie] = useState<TmdbMovieDetails | null>(null)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState<Movie | null | undefined>(undefined)
  const [reviews, setReviews] = useState<ReviewSummary[] | null>(null)
  const [reviewsError, setReviewsError] = useState('')
  const [similar, setSimilar] = useState<TmdbMovie[]>([])

  const [currentId, setCurrentId] = useState(tmdbId)
  if (currentId !== tmdbId) {
    setCurrentId(tmdbId)
    setMovie(null)
    setError('')
    setMetrics(undefined)
    setReviews(null)
    setReviewsError('')
    setSimilar([])
  }

  const { img: poster } = useImageLoader(getPosterUrl(movie?.poster_path))

  const loadTopFlopData = useCallback(() => {
    findOne(tmdbId)
      .then(res => setMetrics(res.data))
      .catch(() => setMetrics(null))

    findByMovie(tmdbId)
      .then(res => setReviews(res.data))
      .catch(error => {
        setReviews([])
        setReviewsError(getErrorMessage(error))
      })
  }, [tmdbId])

  useEffect(() => {
    if (!isValidId) return

    let isMounted = true

    getMovie(tmdbId)
      .then(data => isMounted && setMovie(data))
      .catch(error => isMounted && setError(getErrorMessage(error)))

    getSimilar(tmdbId)
      .then(data => isMounted && setSimilar(data))
      .catch(() => isMounted && setSimilar([]))

    loadTopFlopData()

    return () => {
      isMounted = false
    }
  }, [tmdbId, isValidId, loadTopFlopData])

  return (
    <div className={styles.movie}>
      <Center>
        {(!isValidId || error) && <CardMessage text={error || 'O endereço desse filme é inválido.'} />}
        {isValidId && !error && !movie && <Spinner />}

        {movie && (
          <>
            <div className={styles.movie_box}>
              <img src={poster ?? posterDefault} alt={`Pôster de ${movie.title}`} />
              <MovieInfo movie={movie} metrics={metrics} />
            </div>

            <VideoBox tmdbId={movie.id} />

            <MovieReviews
              key={`reviews-${movie.id}`}
              tmdbId={movie.id}
              reviews={reviews}
              error={reviewsError}
              onChange={loadTopFlopData}
            />

            <Carousel array={similar} text="Mais filmes para você" />
          </>
        )}
      </Center>
    </div>
  )
}

export default MovieDetails

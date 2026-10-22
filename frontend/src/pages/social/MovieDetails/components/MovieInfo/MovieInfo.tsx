import styles from './styles.module.css'
import MovieActions from '../MovieActions/MovieActions'
import TopBadge from '../../../../../components/TopBadge/TopBadge'
import type { TmdbMovieDetails } from '../../../../../types/tmdb'
import type { Movie } from '../../../../../types/movies'
import { formatReleaseDate } from '../../../../../utils/formatReleaseDate'

interface MovieInfoProps {
  movie: TmdbMovieDetails
  metrics?: Movie | null
}

const MovieInfo = ({ movie, metrics }: MovieInfoProps) => {
  const genre = movie.genres.length > 0 ? movie.genres[0].name : 'Indefinido'
  const average = metrics && metrics.reviewCount > 0 ? metrics.topSum / metrics.reviewCount : null

  return (
    <div className={styles.infos}>
      <h1>{movie.title || 'Indefinido'}</h1>

      <div className={styles.meta}>
        <div className={styles.average} title="Nota no TMDB">
          <i className="fa-solid fa-star"></i> {movie.vote_average ? movie.vote_average.toFixed(1) : 0}
        </div>
        <p>{formatReleaseDate(movie.release_date)}</p>
        <i className="fa-solid fa-circle"></i>
        <p>{genre}</p>
        <i className="fa-solid fa-circle"></i>
        <p>{movie.runtime ?? 0}m</p>
      </div>

      <div className={styles.topflop}>
        {metrics === undefined && <p>Carregando nota do TopFlop...</p>}
        {metrics !== undefined && average === null && <p>Ainda sem reviews no TopFlop.</p>}
        {metrics && average !== null && (
          <>
            <TopBadge value={average} title="Média das reviews do TopFlop" />
            <p>média de {metrics.reviewCount} {metrics.reviewCount === 1 ? 'review' : 'reviews'} no TopFlop</p>
          </>
        )}
      </div>

      <h3>Sinopse</h3>
      <p className={styles.plot}>{movie.overview || 'Sem sinopse'}</p>

      <MovieActions
        key={`actions-${movie.id}`}
        tmdbId={movie.id}
        isRegistered={Boolean(metrics)}
        isChecking={metrics === undefined}
      />
    </div>
  )
}

export default MovieInfo

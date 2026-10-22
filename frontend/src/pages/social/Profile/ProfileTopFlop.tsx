import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import styles from './styles/profile-top-flop.module.css'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Spinner from '../../../components/Spinner/Spinner'
import { findAllByUser } from '../../../api/cinema/highlights.service'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { Highlight } from '../../../types/highlights'
import type { TmdbMovie } from '../../../types/tmdb'
import type { ProfileOutletContext } from '../../../types/users'
import { getPosterUrl, posterDefault } from '../../../utils/tmdbImages'

interface HighlightSlotProps {
  kind: 'top' | 'flop'
  movieId: number | null
  movie?: TmdbMovie
}

const HighlightSlot = ({ kind, movieId, movie }: HighlightSlotProps) => {
  const label = kind === 'top' ? 'Top' : 'Flop'

  if (!movieId) {
    return (
      <div className={`${styles.slot} ${styles.empty}`}>
        <span className={`${styles.label} ${styles[kind]}`}>{label}</span>
        <p>Não escolhido</p>
      </div>
    )
  }

  return (
    <Link to={`/filmes/${movieId}`} className={styles.slot}>
      <span className={`${styles.label} ${styles[kind]}`}>{label}</span>
      <img src={getPosterUrl(movie?.poster_path, 'w342') ?? posterDefault} alt={movie ? `Pôster de ${movie.title}` : 'Pôster'} loading="lazy" decoding="async" />
      <p>{movie?.title ?? 'Carregando...'}</p>
    </Link>
  )
}

const ProfileTopFlop = () => {
  const { profileUser, isMyProfile } = useOutletContext<ProfileOutletContext>()
  const [highlights, setHighlights] = useState<Highlight[] | null>(null)

  const movies = useTmdbMovies((highlights ?? []).flatMap(item => [item.topMovieId, item.flopMovieId]))

  useEffect(() => {
    findAllByUser(profileUser.id)
      .then(res => setHighlights(res.data))
      .catch(() => setHighlights([]))
  }, [profileUser.id])

  if (!highlights) return <Spinner />

  if (highlights.length === 0) {
    return (
      <CardMessage
        text={isMyProfile
          ? 'Você ainda não escolheu seu Top e seu Flop do ano. Abra um filme e marque "Meu Top" ou "Meu Flop".'
          : 'Nenhum Top & Flop escolhido ainda.'}
      />
    )
  }

  return (
    <div className={styles.years}>
      {highlights.map(highlight => (
        <section key={highlight.id} className={styles.year}>
          <h3>{highlight.year}</h3>
          <div className={styles.slots}>
            <HighlightSlot
              kind="top"
              movieId={highlight.topMovieId}
              movie={highlight.topMovieId ? movies[highlight.topMovieId] : undefined}
            />
            <HighlightSlot
              kind="flop"
              movieId={highlight.flopMovieId}
              movie={highlight.flopMovieId ? movies[highlight.flopMovieId] : undefined}
            />
          </div>
        </section>
      ))}
    </div>
  )
}

export default ProfileTopFlop

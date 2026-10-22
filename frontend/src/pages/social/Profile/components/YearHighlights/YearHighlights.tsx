import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import { findAllByUser } from '../../../../../api/cinema/highlights.service'
import { useTmdbMovies } from '../../../../../hooks/useTmdbMovies'
import type { Highlight } from '../../../../../types/highlights'
import type { TmdbMovie } from '../../../../../types/tmdb'
import { getReleaseYear } from '../../../../../utils/formatReleaseDate'
import { getPosterUrl, posterDefault } from '../../../../../utils/tmdbImages'

interface SlotProps {
  kind: 'top' | 'flop'
  year: number
  movieId: number | null
  movie?: TmdbMovie
  isMyProfile: boolean
  displayName: string
}

const Slot = ({ kind, year, movieId, movie, isMyProfile, displayName }: SlotProps) => {
  const label = kind === 'top' ? 'Top' : 'Flop'

  if (!movieId) {
    return (
      <div className={`${styles.slot} ${styles.empty} ${styles[kind]}`}>
        <span className={styles.placeholder}>
          <i className={`fa-solid ${kind === 'top' ? 'fa-trophy' : 'fa-thumbs-down'}`}></i>
        </span>
        <div className={styles.info}>
          <span className={styles.label}>{label} de {year}</span>
          <strong>{isMyProfile ? 'Ainda não escolhido' : 'Nada por aqui ainda'}</strong>
          <p>
            {isMyProfile
              ? <>Abra um filme e marque <em>Meu {label} de {year}</em>.</>
              : `${displayName} ainda não escolheu o ${label.toLowerCase()} do ano.`}
          </p>
          {isMyProfile && (
            <Link to="/busca" className={styles.cta}>
              Buscar filme <i className="fa-solid fa-angle-right"></i>
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <Link to={`/filmes/${movieId}`} className={`${styles.slot} ${styles[kind]}`}>
      <img src={getPosterUrl(movie?.poster_path) ?? posterDefault} alt={movie ? `Pôster de ${movie.title}` : 'Pôster'} />
      <div className={styles.info}>
        <span className={styles.label}>{label} de {year}</span>
        <strong>{movie?.title ?? 'Carregando...'}</strong>
        {movie?.release_date && <p>{getReleaseYear(movie.release_date)}</p>}
      </div>
    </Link>
  )
}

interface YearHighlightsProps {
  userId: string
  displayName: string
  isMyProfile: boolean
  basePath: string
}

const YearHighlights = ({ userId, displayName, isMyProfile, basePath }: YearHighlightsProps) => {
  const year = new Date().getFullYear()
  const [highlight, setHighlight] = useState<Highlight | null | undefined>(undefined)

  const movies = useTmdbMovies([highlight?.topMovieId, highlight?.flopMovieId])

  useEffect(() => {
    findAllByUser(userId)
      .then(res => setHighlight(res.data.find(item => item.year === year) ?? null))
      .catch(() => setHighlight(null))
  }, [userId, year])

  if (highlight === undefined) return <div className={styles.skeleton} aria-hidden="true" />

  return (
    <section className={styles.wrapper} aria-label={`Top e Flop de ${year}`}>
      <div className={styles.header}>
        <h2>Top & Flop <span>{year}</span></h2>
        <Link to={`${basePath}/top-flop`}>
          Todos os anos <i className="fa-solid fa-angle-right"></i>
        </Link>
      </div>

      <div className={styles.slots}>
        <Slot
          kind="top"
          year={year}
          movieId={highlight?.topMovieId ?? null}
          movie={highlight?.topMovieId ? movies[highlight.topMovieId] : undefined}
          isMyProfile={isMyProfile}
          displayName={displayName}
        />
        <Slot
          kind="flop"
          year={year}
          movieId={highlight?.flopMovieId ?? null}
          movie={highlight?.flopMovieId ? movies[highlight.flopMovieId] : undefined}
          isMyProfile={isMyProfile}
          displayName={displayName}
        />
      </div>
    </section>
  )
}

export default YearHighlights

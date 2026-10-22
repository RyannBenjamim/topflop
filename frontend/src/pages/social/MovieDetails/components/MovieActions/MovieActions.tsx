import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Button from '../../../../../components/Button/Button'
import Alert from '../../../../../components/Alert/Alert'
import { useAuth } from '../../../../../hooks/useAuth'
import { useTmdbMovies } from '../../../../../hooks/useTmdbMovies'
import { add, findAllByUser, remove } from '../../../../../api/cinema/watchlist.service'
import { findByUserAndYear, removeCurrentYear, upsertCurrentYear } from '../../../../../api/cinema/highlights.service'
import type { Highlight } from '../../../../../types/highlights'
import { getErrorMessage, isRequestError } from '../../../../../utils/requestError'

const currentYear = new Date().getFullYear()

const describeError = (error: unknown) => {
  if (isRequestError(error) && error.errorCode === 'FOREIGN_KEY_CONSTRAINT') {
    return 'Esse filme ainda não está cadastrado no TopFlop. Ele passa a existir depois da primeira review.'
  }
  if (isRequestError(error) && error.errorCode === 'UNIQUE_CONSTRAINT') return 'Esse filme já está na sua lista.'
  return getErrorMessage(error)
}

interface MovieActionsProps {
  tmdbId: number
  isRegistered: boolean
  isChecking: boolean
}

type Busy = '' | 'watchlist' | 'top' | 'flop'

const MovieActions = ({ tmdbId, isRegistered, isChecking }: MovieActionsProps) => {
  const { user } = useAuth()
  const [inWatchlist, setInWatchlist] = useState<boolean | null>(null)
  const [highlight, setHighlight] = useState<Highlight | null | undefined>(undefined)
  const [busy, setBusy] = useState<Busy>('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    findAllByUser(user.id)
      .then(res => setInWatchlist(res.data.some(item => item.movieTmdbId === tmdbId)))
      .catch(() => setInWatchlist(false))

    findByUserAndYear(user.id, currentYear)
      .then(res => setHighlight(res.data))
      .catch(() => setHighlight(null))
  }, [user, tmdbId])

  const otherTopId = highlight?.topMovieId && highlight.topMovieId !== tmdbId ? highlight.topMovieId : null
  const otherFlopId = highlight?.flopMovieId && highlight.flopMovieId !== tmdbId ? highlight.flopMovieId : null
  const others = useTmdbMovies([otherTopId, otherFlopId])

  const isTop = highlight?.topMovieId === tmdbId
  const isFlop = highlight?.flopMovieId === tmdbId
  const disabled = !isRegistered

  const toggleWatchlist = async () => {
    setBusy('watchlist')
    setError('')

    try {
      if (inWatchlist) {
        await remove(tmdbId)
      } else {
        await add(tmdbId)
      }
      setInWatchlist(!inWatchlist)
    } catch (error) {
      setError(describeError(error))
    } finally {
      setBusy('')
    }
  }

  const saveHighlight = async (kind: Busy, topMovieId?: number | null, flopMovieId?: number | null) => {
    setBusy(kind)
    setError('')

    try {
      if (!topMovieId && !flopMovieId) {
        await removeCurrentYear()
        setHighlight(null)
      } else {
        const response = await upsertCurrentYear({
          topMovieId: topMovieId ?? undefined,
          flopMovieId: flopMovieId ?? undefined,
        })
        setHighlight(response.data)
      }
    } catch (error) {
      setError(describeError(error))
    } finally {
      setBusy('')
    }
  }

  const toggleTop = () => saveHighlight('top', isTop ? null : tmdbId, isFlop ? null : highlight?.flopMovieId)
  const toggleFlop = () => saveHighlight('flop', isTop ? null : highlight?.topMovieId, isFlop ? null : tmdbId)

  return (
    <div className={styles.actions}>
      <div className={styles.buttons}>
        <Button
          variant={inWatchlist ? 'primary' : 'outline'}
          icon={inWatchlist ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}
          disabled={disabled || inWatchlist === null}
          isLoading={busy === 'watchlist'}
          onClick={toggleWatchlist}
        >
          {inWatchlist ? 'Na minha lista' : 'Quero assistir'}
        </Button>

        <Button
          variant={isTop ? 'accent' : 'outline'}
          icon="fa-solid fa-trophy"
          disabled={disabled || highlight === undefined}
          isLoading={busy === 'top'}
          onClick={toggleTop}
        >
          {isTop ? `Top de ${currentYear}` : `Meu Top de ${currentYear}`}
        </Button>

        <Button
          variant={isFlop ? 'danger' : 'outline'}
          icon="fa-solid fa-thumbs-down"
          disabled={disabled || highlight === undefined}
          isLoading={busy === 'flop'}
          onClick={toggleFlop}
        >
          {isFlop ? `Flop de ${currentYear}` : `Meu Flop de ${currentYear}`}
        </Button>
      </div>

      {!isChecking && !isRegistered && (
        <p className={styles.hint}>
          A lista e o Top/Flop do ano ficam disponíveis depois que o filme receber a primeira review no TopFlop.
        </p>
      )}

      {isRegistered && otherTopId && (
        <p className={styles.hint}>
          Seu Top de {currentYear} hoje: <Link to={`/filmes/${otherTopId}`}>{others[otherTopId]?.title ?? 'outro filme'}</Link>. Marcar este substitui a escolha.
        </p>
      )}

      {isRegistered && otherFlopId && (
        <p className={styles.hint}>
          Seu Flop de {currentYear} hoje: <Link to={`/filmes/${otherFlopId}`}>{others[otherFlopId]?.title ?? 'outro filme'}</Link>. Marcar este substitui a escolha.
        </p>
      )}

      <Alert type="error">{error}</Alert>
    </div>
  )
}

export default MovieActions

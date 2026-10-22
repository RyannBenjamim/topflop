import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import CardSearch from '../../../components/CardSearch/CardSearch'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Spinner from '../../../components/Spinner/Spinner'
import Button from '../../../components/Button/Button'
import Alert from '../../../components/Alert/Alert'
import { findAllByUser, remove } from '../../../api/cinema/watchlist.service'
import { useAuth } from '../../../hooks/useAuth'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { WatchlistItem } from '../../../types/watchlist'
import { getErrorMessage } from '../../../utils/requestError'
import { getPosterUrl } from '../../../utils/tmdbImages'

const MyList = () => {
  const { user } = useAuth()
  const [items, setItems] = useState<WatchlistItem[] | null>(null)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState<number | null>(null)

  const movies = useTmdbMovies((items ?? []).map(item => item.movieTmdbId))

  useEffect(() => {
    if (!user) return

    findAllByUser(user.id)
      .then(res => setItems(res.data))
      .catch(error => {
        setItems([])
        setError(getErrorMessage(error))
      })
  }, [user])

  const handleRemove = async (movieTmdbId: number) => {
    setRemovingId(movieTmdbId)
    setError('')

    try {
      await remove(movieTmdbId)
      setItems(current => (current ?? []).filter(item => item.movieTmdbId !== movieTmdbId))
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className={styles.mylist}>
      <Center>
        <h3>Minha lista</h3>
        <p className={styles.subtitle}>Filmes que você salvou para assistir depois.</p>

        <div className={styles.container}>
          <Alert type="error">{error}</Alert>
          {items === null && <Spinner />}
          {items && items.length === 0 && !error && (
            <CardMessage text='Você ainda não salvou nenhum filme. Abra um filme e toque em "Quero assistir".' />
          )}
          {items && items.map(item => {
            const movie = movies[item.movieTmdbId]

            return (
              <CardSearch
                key={item.movieTmdbId}
                id={item.movieTmdbId}
                img={getPosterUrl(movie?.poster_path, 'w185')}
                title={movie?.title ?? 'Carregando...'}
                data={movie?.release_date}
                plot={movie?.overview ?? ''}
              >
                <Button
                  variant="ghost"
                  icon="fa-solid fa-trash"
                  title="Remover da lista"
                  aria-label="Remover da lista"
                  isLoading={removingId === item.movieTmdbId}
                  onClick={() => handleRemove(item.movieTmdbId)}
                />
              </CardSearch>
            )
          })}
        </div>
      </Center>
    </div>
  )
}

export default MyList

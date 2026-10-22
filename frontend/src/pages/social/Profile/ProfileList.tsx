import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styles from './styles/profile-list.module.css'
import CardSearch from '../../../components/CardSearch/CardSearch'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Spinner from '../../../components/Spinner/Spinner'
import { findAllByUser } from '../../../api/cinema/watchlist.service'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { WatchlistItem } from '../../../types/watchlist'
import type { ProfileOutletContext } from '../../../types/users'
import { getPosterUrl } from '../../../utils/tmdbImages'

const ProfileList = () => {
  const { profileUser } = useOutletContext<ProfileOutletContext>()
  const [items, setItems] = useState<WatchlistItem[] | null>(null)

  const movies = useTmdbMovies((items ?? []).map(item => item.movieTmdbId))

  useEffect(() => {
    findAllByUser(profileUser.id)
      .then(res => setItems(res.data))
      .catch(() => setItems([]))
  }, [profileUser.id])

  if (!items) return <Spinner />

  if (items.length === 0) return <CardMessage text="Nenhum filme na lista." />

  return (
    <div className={styles.list}>
      {items.map(item => {
        const movie = movies[item.movieTmdbId]

        return (
          <CardSearch
            key={item.movieTmdbId}
            id={item.movieTmdbId}
            img={getPosterUrl(movie?.poster_path, 'w185')}
            title={movie?.title ?? 'Carregando...'}
            data={movie?.release_date}
            plot={movie?.overview ?? ''}
          />
        )
      })}
    </div>
  )
}

export default ProfileList

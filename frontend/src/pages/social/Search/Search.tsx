import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import InputSearch from '../../../components/InputSearch/InputSearch'
import CardSearch from '../../../components/CardSearch/CardSearch'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Spinner from '../../../components/Spinner/Spinner'
import { searchMovies } from '../../../api/tmdb/tmdb.service'
import type { TmdbMovie } from '../../../types/tmdb'
import { getErrorMessage } from '../../../utils/requestError'
import { getPosterUrl } from '../../../utils/tmdbImages'

interface SearchResult {
  query: string
  movies: TmdbMovie[]
  error: string
}

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [result, setResult] = useState<SearchResult | null>(null)

  useEffect(() => {
    if (!query) return

    let isMounted = true

    searchMovies(query)
      .then(movies => isMounted && setResult({ query, movies, error: '' }))
      .catch(error => isMounted && setResult({ query, movies: [], error: getErrorMessage(error) }))

    return () => {
      isMounted = false
    }
  }, [query])

  const current = result?.query === query ? result : null

  return (
    <div className={styles.search}>
      <Center>
        <div className={styles.input}>
          <InputSearch key={query} text="Pesquise por um filme" width="100%" initialValue={query} />
        </div>

        <div className={styles.container}>
          {!query && <CardMessage text="Pesquise um filme para escrever sua review, salvar na lista ou escolher como Top ou Flop do ano." />}
          {query && !current && <Spinner />}
          {current?.error && <CardMessage text={current.error} />}
          {current && !current.error && current.movies.length === 0 && (
            <CardMessage text={`Nenhum filme chamado ${query} foi encontrado`} />
          )}
          {current?.movies.map(movie => (
            <CardSearch
              key={movie.id}
              id={movie.id}
              img={getPosterUrl(movie.poster_path, 'w185')}
              title={movie.title || 'Indefinido'}
              data={movie.release_date}
              plot={movie.overview || 'Sem sinopse'}
            />
          ))}
        </div>
      </Center>
    </div>
  )
}

export default Search

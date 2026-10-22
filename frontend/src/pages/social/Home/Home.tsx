import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Banner from '../../../components/Banner/Banner'
import Center from '../../../components/Center/Center'
import Logo from '../../../components/Logo/Logo'
import Carousel from '../../../components/Carousel/Carousel'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import ReviewCard from '../../../components/ReviewCard/ReviewCard'
import SeeMore from '../../../components/SeeMore/SeeMore'
import FeedTabs from '../../../components/FeedTabs/FeedTabs'
import FeedEmpty from '../../../components/FeedTabs/FeedEmpty'
import { getAnimations, getPopular, getTopRated } from '../../../api/tmdb/tmdb.service'
import { useReviewFeed, type FeedTab } from '../../../hooks/useReviewFeed'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import { useUsersDirectory } from '../../../hooks/useUsersDirectory'
import type { TmdbMovie } from '../../../types/tmdb'
import { getErrorMessage } from '../../../utils/requestError'
import { getBackdropUrl } from '../../../utils/tmdbImages'

const feedPreviewSize = 6

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [tmdbError, setTmdbError] = useState('')
  const [popularMovies, setPopularMovies] = useState<TmdbMovie[]>([])
  const [bestMovies, setBestMovies] = useState<TmdbMovie[]>([])
  const [animations, setAnimations] = useState<TmdbMovie[]>([])
  const [activeTab, setActiveTab] = useState<FeedTab>('recent')
  const { feed, error: reviewsError, followingIds } = useReviewFeed(activeTab)

  const visibleReviews = (feed ?? []).slice(0, feedPreviewSize)

  const users = useUsersDirectory()
  const movies = useTmdbMovies(visibleReviews.map(review => review.movieTmdbId))

  useEffect(() => {
    Promise.all([getPopular(), getTopRated(), getAnimations()])
      .then(([popular, best, animation]) => {
        setPopularMovies(popular)
        setBestMovies(best)
        setAnimations(animation)
      })
      .catch(error => setTmdbError(getErrorMessage(error)))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className={styles.home}>
      <Banner
        img={getBackdropUrl(popularMovies[0]?.backdrop_path)}
        imgMobile={getBackdropUrl(popularMovies[0]?.backdrop_path, 'w780')}
      >
        <h1><Logo size="large" /></h1>
        <p>Avalie filmes, descubra o que é Top e o que é Flop e acompanhe quem entende de cinema.</p>
      </Banner>

      <Center>
        <section className={styles.section}>
          <div className={styles.section_header}>
            <h3>Feed de reviews</h3>
            <Link to="/comunidade">Ver comunidade <i className="fa-solid fa-angle-right"></i></Link>
          </div>

          <FeedTabs active={activeTab} onChange={setActiveTab} />

          {feed === null && !reviewsError && <Spinner />}
          {reviewsError && <CardMessage text={reviewsError} />}
          {feed && !reviewsError && feed.length === 0 && <FeedEmpty tab={activeTab} followingIds={followingIds} />}
          {feed && feed.length > 0 && (
            <div className={styles.list}>
              {visibleReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  movie={movies[review.movieTmdbId]}
                  author={users[review.authorId]}
                  showMovie
                  showAuthor
                />
              ))}

              {feed.length > feedPreviewSize && (
                <SeeMore to={activeTab === 'friends' ? '/reviews?aba=amigos' : '/reviews'} total={feed.length} />
              )}
            </div>
          )}
        </section>

        {isLoading && <Spinner />}
        {tmdbError && <div className={styles.section}><CardMessage text={tmdbError} /></div>}
        {!isLoading && !tmdbError && (
          <>
            <Carousel array={popularMovies} text="Filmes do momento" />
            <Carousel array={bestMovies} text="Filmes aclamados pela crítica" />
            <Carousel array={animations} text="Animações do momento" />
          </>
        )}
      </Center>
    </div>
  )
}

export default Home

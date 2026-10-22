import { useRef, type MouseEvent } from 'react'
import styles from './styles.module.css'
import Card from '../Card/Card'
import type { TmdbMovie } from '../../types/tmdb'
import { getPosterUrl, posterDefault } from '../../utils/tmdbImages'

interface CarouselProps {
  array: TmdbMovie[]
  text: string
}

const Carousel = ({ array, text }: CarouselProps) => {
  const carousel = useRef<HTMLDivElement | null>(null)

  const handleLeftClick = (e: MouseEvent) => {
    e.preventDefault()
    if (carousel.current) carousel.current.scrollLeft -= (carousel.current.offsetWidth - 200)
  }

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault()
    if (carousel.current) carousel.current.scrollLeft += (carousel.current.offsetWidth - 200)
  }

  if (array.length === 0) return null

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{text}</h3>
      <div ref={carousel} className={styles.carousel}>
        {array.map(movie => (
          <Card
            img={getPosterUrl(movie.poster_path, 'w342') ?? posterDefault}
            key={movie.id}
            id={movie.id}
            title={movie.title}
          />
        ))}
      </div>

      <div className={styles.buttons}>
        <button onClick={handleLeftClick} className={styles.buttonLeftClick} aria-label="Voltar">
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <button onClick={handleRightClick} className={styles.buttonRightClick} aria-label="Avançar">
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
  )
}

export default Carousel

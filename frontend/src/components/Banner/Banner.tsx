import type { CSSProperties, ReactNode } from 'react'
import styles from './styles.module.css'
import { useImageLoader } from '../../hooks/useImageLoader'

interface BannerProps {
  img?: string
  imgMobile?: string
  children: ReactNode
}

const mobileQuery = '(max-width: 700px), (max-height: 500px) and (orientation: landscape)'

const Banner = ({ img, imgMobile, children }: BannerProps) => {
  const isMobile = typeof window !== 'undefined' && window.matchMedia(mobileQuery).matches
  const { img: loadedImg } = useImageLoader(isMobile ? imgMobile ?? img : img)

  const style = img
    ? { '--banner-img': `url(${img})`, '--banner-img-mobile': `url(${imgMobile ?? img})` } as CSSProperties
    : undefined

  return (
    <div className={styles.banner}>
      {img && (
        <div className={`${styles.backdrop} ${loadedImg ? styles.loaded : ''}`} style={style} aria-hidden="true" />
      )}
      {children}
    </div>
  )
}

export default Banner

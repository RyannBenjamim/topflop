import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Divider from '../../../../../components/Divider/Divider'
import { getVideos } from '../../../../../api/tmdb/tmdb.service'
import type { TmdbVideo } from '../../../../../types/tmdb'

const getTrailerUrl = (videos: TmdbVideo[]) => {
  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube')
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
}

const VideoBox = ({ tmdbId }: { tmdbId: number }) => {
  const [videos, setVideos] = useState<TmdbVideo[]>([])

  useEffect(() => {
    getVideos(tmdbId).then(setVideos).catch(() => setVideos([]))
  }, [tmdbId])

  const url = getTrailerUrl(videos)

  if (!url) return <Divider />

  return (
    <div>
      <Divider />

      <div className={styles.video}>
        <iframe
          src={url}
          title="Trailer no YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <Divider />
    </div>
  )
}

export default VideoBox

import styles from './styles.module.css'

interface LikeButtonProps {
  isLiked: boolean
  count: number
  onToggle: () => void
  isLoading?: boolean
}

const LikeButton = ({ isLiked, count, onToggle, isLoading = false }: LikeButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.like} ${isLiked ? styles.liked : ''}`}
      onClick={onToggle}
      disabled={isLoading}
      aria-pressed={isLiked}
      title={isLiked ? 'Descurtir' : 'Curtir'}
    >
      <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
      <span>{count}</span>
    </button>
  )
}

export default LikeButton

import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import TopBadge from '../../../components/TopBadge/TopBadge'
import Avatar from '../../../components/Avatar/Avatar'
import Button from '../../../components/Button/Button'
import Alert from '../../../components/Alert/Alert'
import LikeButton from '../../../components/LikeButton/LikeButton'
import ReviewForm from '../../../components/ReviewForm/ReviewForm'
import Comments from './components/Comments/Comments'
import { findOne, remove, update } from '../../../api/reviews.service'
import { findOne as findUser } from '../../../api/users.service'
import { findManyByReview, like, unlike } from '../../../api/likes/review-likes.service'
import { useAuth } from '../../../hooks/useAuth'
import { useTmdbMovies } from '../../../hooks/useTmdbMovies'
import type { Review, ReviewFormValues } from '../../../types/reviews'
import type { User } from '../../../types/users'
import type { Like } from '../../../types/likes'
import { formatReleaseDate, getReleaseYear } from '../../../utils/formatReleaseDate'
import { getPosterUrl, posterDefault } from '../../../utils/tmdbImages'
import { getErrorMessage, isRequestError } from '../../../utils/requestError'
import { wasEdited } from '../../../utils/wasEdited'

const likedByText = (likes: Like[]) => {
  const names = likes.map(item => item.user.name || item.user.username)
  if (names.length === 0) return ''
  if (names.length <= 2) return `Curtido por ${names.join(' e ')}`
  return `Curtido por ${names.slice(0, 2).join(', ')} e mais ${names.length - 2}`
}

const ExpandedReview = () => {
  const { review_id } = useParams<{ review_id: string }>()
  const reviewId = review_id ?? ''
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [review, setReview] = useState<Review | null>(null)
  const [error, setError] = useState('')
  const [author, setAuthor] = useState<User | null>(null)
  const [likes, setLikes] = useState<Like[] | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const movies = useTmdbMovies([review?.movieTmdbId])
  const movie = review ? movies[review.movieTmdbId] : undefined

  const loadLikes = useCallback(() => {
    findManyByReview(reviewId)
      .then(res => setLikes(res.data))
      .catch(() => setLikes([]))
  }, [reviewId])

  useEffect(() => {
    let isMounted = true

    async function loadReview() {
      try {
        const response = await findOne(reviewId)
        if (!isMounted) return
        setReview(response.data)

        const authorResponse = await findUser(response.data.authorId)
        if (isMounted) setAuthor(authorResponse.data)
      } catch (error) {
        if (!isMounted) return
        const notFound = isRequestError(error) && (error.status === 404 || error.status === 400)
        setError(notFound ? 'Essa review não existe ou foi excluída.' : getErrorMessage(error))
      }
    }

    loadReview()
    loadLikes()

    return () => {
      isMounted = false
    }
  }, [reviewId, loadLikes])

  const isAuthor = review?.authorId === user?.id
  const isLiked = Boolean(likes?.some(item => item.user.id === user?.id))

  const toggleLike = async () => {
    if (!user) return
    setIsLiking(true)

    try {
      if (isLiked) {
        await unlike(reviewId)
        setLikes(current => (current ?? []).filter(item => item.user.id !== user.id))
      } else {
        await like(reviewId)
        setLikes(current => [
          ...(current ?? []),
          {
            createdAt: new Date().toISOString(),
            user: { id: user.id, username: profile?.username ?? '', email: profile?.email ?? '', name: profile?.name ?? null },
          },
        ])
      }
    } catch (error) {
      setActionError(getErrorMessage(error))
      loadLikes()
    } finally {
      setIsLiking(false)
    }
  }

  const handleUpdate = async (values: ReviewFormValues) => {
    const response = await update(reviewId, values)
    setReview(response.data)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!review || !window.confirm('Excluir esta review? Essa ação não pode ser desfeita.')) return

    setIsDeleting(true)
    setActionError('')

    try {
      await remove(reviewId)
      navigate(`/filmes/${review.movieTmdbId}`, { replace: true })
    } catch (error) {
      setActionError(isRequestError(error) && error.errorCode === 'FOREIGN_KEY_CONSTRAINT'
        ? 'A API não permite excluir uma review que já recebeu comentários ou curtidas.'
        : getErrorMessage(error))
      setIsDeleting(false)
    }
  }

  if (error) {
    return (
      <div className={styles.review}>
        <Center><CardMessage text={error} /></Center>
      </div>
    )
  }

  if (!review) {
    return (
      <div className={styles.review}>
        <Center><Spinner /></Center>
      </div>
    )
  }

  const authorName = author ? author.name || author.username : 'Carregando...'

  return (
    <div className={styles.review}>
      <Center>
        <Link to={`/filmes/${review.movieTmdbId}`} className={styles.movie}>
          <img src={getPosterUrl(movie?.poster_path) ?? posterDefault} alt={movie ? `Pôster de ${movie.title}` : 'Pôster'} />
          <div>
            <p>Review de</p>
            <h2>
              {movie?.title ?? 'Carregando filme...'}
              {movie?.release_date && <span> ({getReleaseYear(movie.release_date)})</span>}
            </h2>
          </div>
        </Link>

        {isEditing ? (
          <ReviewForm
            initialValues={{ title: review.title, content: review.content, topPercentage: review.topPercentage }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="Salvar alterações"
          />
        ) : (
          <article className={styles.card}>
            <div className={styles.head}>
              <TopBadge value={review.topPercentage} />
              {isAuthor && (
                <div className={styles.actions}>
                  <Button variant="ghost" icon="fa-solid fa-pen" onClick={() => setIsEditing(true)}>Editar</Button>
                  <Button variant="danger" icon="fa-solid fa-trash" onClick={handleDelete} isLoading={isDeleting}>Excluir</Button>
                </div>
              )}
            </div>

            <h1>{review.title}</h1>

            <Link to={author ? `/perfil/${author.username}` : '#'} className={styles.author}>
              <Avatar name={author ? authorName : undefined} size="small" />
              <span>
                <strong>{authorName}</strong>
                {author && <> @{author.username}</>}
                {' · '}{formatReleaseDate(review.createdAt)}
                {wasEdited(review.createdAt, review.updatedAt) && ' (editada)'}
              </span>
            </Link>

            <div className={styles.content}>{review.content}</div>

            <div className={styles.footer}>
              <LikeButton
                isLiked={isLiked}
                count={likes?.length ?? 0}
                onToggle={toggleLike}
                isLoading={isLiking || likes === null}
              />
              {likes && <p>{likedByText(likes)}</p>}
            </div>

            <Alert type="error">{actionError}</Alert>
          </article>
        )}

        <Comments key={reviewId} reviewId={reviewId} />
      </Center>
    </div>
  )
}

export default ExpandedReview

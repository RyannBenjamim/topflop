import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Avatar from '../../../../../components/Avatar/Avatar'
import Button from '../../../../../components/Button/Button'
import Alert from '../../../../../components/Alert/Alert'
import LikeButton from '../../../../../components/LikeButton/LikeButton'
import { remove, update } from '../../../../../api/comments.service'
import { findManyByComment, like, unlike } from '../../../../../api/likes/comment-likes.service'
import { useAuth } from '../../../../../hooks/useAuth'
import type { Comment } from '../../../../../types/comments'
import type { Like } from '../../../../../types/likes'
import { formatRelativeTime } from '../../../../../utils/formatRelativeTime'
import { getErrorMessage, isRequestError } from '../../../../../utils/requestError'
import { validateComment } from '../../../../../utils/validators'
import { wasEdited } from '../../../../../utils/wasEdited'

interface CommentItemProps {
  comment: Comment
  onUpdated: (comment: Comment) => void
  onRemoved: (commentId: string) => void
}

const CommentItem = ({ comment, onUpdated, onRemoved }: CommentItemProps) => {
  const { user, profile } = useAuth()
  const [likes, setLikes] = useState<Like[] | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(comment.content)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    findManyByComment(comment.id)
      .then(res => setLikes(res.data))
      .catch(() => setLikes([]))
  }, [comment.id])

  const isOwner = comment.user.id === user?.id
  const isLiked = Boolean(likes?.some(item => item.user.id === user?.id))
  const displayName = comment.user.name || comment.user.username

  const toggleLike = async () => {
    if (!user) return
    setIsLiking(true)
    setError('')

    try {
      if (isLiked) {
        await unlike(comment.id)
        setLikes(current => (current ?? []).filter(item => item.user.id !== user.id))
      } else {
        await like(comment.id)
        setLikes(current => [
          ...(current ?? []),
          {
            createdAt: new Date().toISOString(),
            user: { id: user.id, username: profile?.username ?? '', email: profile?.email ?? '', name: profile?.name ?? null },
          },
        ])
      }
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsLiking(false)
    }
  }

  const handleSave = async () => {
    const validation = validateComment(draft)
    if (validation) {
      setError(validation)
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await update(comment.id, draft.trim())
      onUpdated(response.data)
      setIsEditing(false)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Excluir este comentário?')) return

    setIsSaving(true)
    setError('')

    try {
      await remove(comment.id)
      onRemoved(comment.id)
    } catch (error) {
      setError(isRequestError(error) && error.errorCode === 'FOREIGN_KEY_CONSTRAINT'
        ? 'A API não permite excluir um comentário que já recebeu curtidas.'
        : getErrorMessage(error))
      setIsSaving(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setDraft(comment.content)
    setError('')
  }

  return (
    <div className={styles.comment}>
      <Link to={`/perfil/${comment.user.username}`}>
        <Avatar name={displayName} size="small" />
      </Link>

      <div className={styles.body}>
        <p className={styles.meta}>
          <Link to={`/perfil/${comment.user.username}`}><strong>{displayName}</strong></Link>
          <span> · {formatRelativeTime(comment.createdAt)}{wasEdited(comment.createdAt, comment.updatedAt) && ' (editado)'}</span>
        </p>

        {isEditing ? (
          <div className={styles.edit}>
            <textarea
              aria-label="Editar comentário"
              maxLength={500}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className={styles.edit_actions}>
              <Button variant="ghost" onClick={cancelEdit} disabled={isSaving}>Cancelar</Button>
              <Button onClick={handleSave} isLoading={isSaving}>Salvar</Button>
            </div>
          </div>
        ) : (
          <p className={styles.content}>{comment.content}</p>
        )}

        <div className={styles.footer}>
          <LikeButton
            isLiked={isLiked}
            count={likes?.length ?? 0}
            onToggle={toggleLike}
            isLoading={isLiking || likes === null}
          />
          {isOwner && !isEditing && (
            <>
              <Button variant="ghost" icon="fa-solid fa-pen" onClick={() => setIsEditing(true)}>Editar</Button>
              <Button variant="ghost" icon="fa-solid fa-trash" onClick={handleDelete} isLoading={isSaving}>Excluir</Button>
            </>
          )}
        </div>

        <Alert type="error">{error}</Alert>
      </div>
    </div>
  )
}

export default CommentItem

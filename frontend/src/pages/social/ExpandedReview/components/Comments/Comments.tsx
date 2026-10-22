import { useEffect, useState, type FormEvent } from 'react'
import styles from './styles.module.css'
import Divider from '../../../../../components/Divider/Divider'
import Spinner from '../../../../../components/Spinner/Spinner'
import Button from '../../../../../components/Button/Button'
import Alert from '../../../../../components/Alert/Alert'
import CardMessage from '../../../../../components/CardMessage/CardMessage'
import CommentItem from '../CommentItem/CommentItem'
import { create, findManyByReview } from '../../../../../api/comments.service'
import type { Comment } from '../../../../../types/comments'
import { getErrorMessage } from '../../../../../utils/requestError'
import { validateComment } from '../../../../../utils/validators'

const Comments = ({ reviewId }: { reviewId: string }) => {
  const [comments, setComments] = useState<Comment[] | null>(null)
  const [error, setError] = useState('')
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    findManyByReview(reviewId)
      .then(res => setComments(res.data))
      .catch(error => {
        setComments([])
        setError(getErrorMessage(error))
      })
  }, [reviewId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const validation = validateComment(content)
    setFormError(validation)
    if (validation) return

    setIsSending(true)

    try {
      const response = await create({ content: content.trim(), reviewId })
      setComments(current => [...(current ?? []), response.data])
      setContent('')
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setIsSending(false)
    }
  }

  const handleUpdated = (updated: Comment) => {
    setComments(current => (current ?? []).map(comment => (comment.id === updated.id ? updated : comment)))
  }

  const handleRemoved = (commentId: string) => {
    setComments(current => (current ?? []).filter(comment => comment.id !== commentId))
  }

  return (
    <section className={styles.comments}>
      <Divider />

      <h3>Comentários {comments && comments.length > 0 && <span>{comments.length}</span>}</h3>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <textarea
          placeholder="Escreva um comentário..."
          aria-label="Novo comentário"
          maxLength={500}
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setFormError('')
          }}
        />
        <div className={styles.form_footer}>
          <p>{content.trim().length}/500</p>
          <Button type="submit" icon="fa-solid fa-paper-plane" isLoading={isSending}>Comentar</Button>
        </div>
        <Alert type="error">{formError}</Alert>
      </form>

      {comments === null && <Spinner />}
      {error && <CardMessage text={error} />}
      {comments && !error && comments.length === 0 && (
        <CardMessage text="Nenhum comentário ainda. Comece a conversa!" />
      )}

      {comments && comments.length > 0 && (
        <div className={styles.list}>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdated={handleUpdated}
              onRemoved={handleRemoved}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Comments

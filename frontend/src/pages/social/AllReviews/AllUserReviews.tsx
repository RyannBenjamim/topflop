import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewsShell from './ReviewsShell'
import Avatar from '../../../components/Avatar/Avatar'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import PagedReviews from '../../../components/PagedReviews/PagedReviews'
import { findByAuthor } from '../../../api/reviews.service'
import { loadUsers } from '../../../hooks/useUsersDirectory'
import { useAuth } from '../../../hooks/useAuth'
import type { ReviewSummary } from '../../../types/reviews'
import type { UserSummary } from '../../../types/users'
import { getErrorMessage } from '../../../utils/requestError'

const AllUserReviews = () => {
  const { username = '' } = useParams<{ username: string }>()
  const { user } = useAuth()
  const [author, setAuthor] = useState<UserSummary | null>(null)
  const [reviews, setReviews] = useState<ReviewSummary[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setAuthor(null)
        setReviews(null)
        setError('')

        const users = await loadUsers()
        const found = users.find(item => item.username.toLowerCase() === username.toLowerCase())
        if (!found) throw new Error('Usuário não encontrado.')
        if (isMounted) setAuthor(found)

        const response = await findByAuthor(found.id)
        if (isMounted) setReviews(response.data)
      } catch (error) {
        if (!isMounted) return
        setReviews([])
        setError(getErrorMessage(error))
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [username])

  const isMe = author?.id === user?.id
  const name = author ? author.name || author.username : ''

  return (
    <ReviewsShell
      back={{ to: `/perfil/${username}`, label: 'Voltar para o perfil' }}
      title={author ? (isMe ? 'Minhas reviews' : `Reviews de ${name}`) : 'Reviews'}
      subtitle={author ? `@${author.username}` : undefined}
      media={author ? <Avatar name={name} size="medium" /> : undefined}
    >
      {reviews === null && <Spinner />}
      {error && <CardMessage text={error} />}
      {reviews && !error && reviews.length === 0 && (
        <CardMessage text={isMe ? 'Você ainda não publicou reviews.' : `${name} ainda não publicou reviews.`} />
      )}
      {reviews && reviews.length > 0 && <PagedReviews reviews={reviews} showMovie />}
    </ReviewsShell>
  )
}

export default AllUserReviews
